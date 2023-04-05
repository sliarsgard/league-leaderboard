import { error } from '@sveltejs/kit';
import { calculateEloChange } from './elo';
import type { RequestHandler } from './$types';
import type { GameInsert, PlayerGameDataInsert } from '$lib/types/database';

export interface RequestData {
	players: PlayerGameDataInsert[]
	game: GameInsert
}

export const POST: RequestHandler = (async ({ request, locals }) => {
	const { supabase, getSession } = locals;
	const session = await getSession();
	if (!session) throw error(401, 'Unauthorized');

	try {
		const { players, game }: RequestData = await request.json();
		const playerIds = players.map((p) => p.player_id);
		const dbPlayerElosRes = await supabase.from('players').select('*').in('id', playerIds);
		if (dbPlayerElosRes.error) throw error(500, 'An error occurred while fetching players.');
		const dbPlayers = dbPlayerElosRes.data;
		if (dbPlayers.length !== playerIds.length)
			return new Response('Some players were not found in the database.', { status: 400 });

		const winningPlayers = dbPlayers.filter((player) => players.find((p) => p.player_id === player.id)?.win);
		const losingPlayers = dbPlayers.filter((player) => !players.find((p) => p.player_id === player.id)?.win);
		const eloChanges = await calculateEloChange(winningPlayers, losingPlayers);

		const gameRes = await supabase.from('games').insert(game).select('*').single();
		if (gameRes.error) throw error(500, `An error occurred while creating game. ${gameRes.error.message}`);
		const gameId = gameRes.data.id;

		const updatePlayers = players.map(async (player) => {
			const dbPlayer = dbPlayers.find((p) => p.id === player.player_id);
			if (!dbPlayer) throw error(500, 'An error occurred while updating player data.');

			const eloChange = eloChanges.find((p) => p.id === player.player_id)?.eloChange || 0;
			const newElo = dbPlayer.elo + eloChange;
			const win = player.win;

			const wins = win ? dbPlayer.wins + 1 : dbPlayer.wins;
			const losses = win ? dbPlayer.losses : dbPlayer.losses + 1;

			const playerGameData: PlayerGameDataInsert = {
				...player,
				game_id: gameId,
				elo_change: eloChange
			};
			const { error: insertError } = await supabase.from('player_game_data').insert(playerGameData);
			if (insertError) throw error(500, 'An error occurred while inserting player game data.');
			const { error: updateError } = await supabase
				.from('players')
				.update({ elo: newElo, wins, losses })
				.eq('id', playerGameData.player_id);

			if (updateError) throw error(500, 'An error occurred while updating player data.');
		});

		await Promise.all(updatePlayers);

		return new Response('Game results processed successfully.');
	} catch (err) {
		console.error(err);
		throw error(500, 'Error processing game results.');
	}
}) satisfies RequestHandler;
