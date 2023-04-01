import { error } from '@sveltejs/kit';
import type { GameDataInput } from '$lib/types';
import { calculateEloChange } from './elo';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = (async ({ request, locals }) => {
	const { supabase, getSession } = locals;
	const session = await getSession();
	if (!session) throw error(401, 'Unauthorized');
	try {
		const { players, bans }: GameDataInput = await request.json();
		const playerIds = players.map((p) => p.id);
		const dbPlayersRes = await supabase.from('players').select('*').in('id', playerIds);
		if (dbPlayersRes.error) throw error(500, 'An error occurred while fetching players.');
		const dbPlayers = dbPlayersRes.data;
		if (dbPlayers.length !== playerIds.length)
			return new Response('Some players were not found in the database.', { status: 400 });

		const eloChanges = await calculateEloChange(
			dbPlayers.filter((player) => players.find((p) => p.id === player.id)?.won),
			dbPlayers.filter((player) => !players.find((p) => p.id === player.id)?.won)
		);

		const gameData = {
			bans_blue: bans.blue,
			bans_red: bans.red,
			blue_team_win: players.find((p) => p.won)?.team === 'blue'
		};

		const gameRes = await supabase.from('games').insert(gameData).select('*').single();
		if (gameRes.error) throw error(500, 'An error occurred while creating game.');
		const gameId = gameRes.data.id;

		const updatePlayers = dbPlayers.map(async (dbPlayer) => {
			const player = players.find((p) => p.id === dbPlayer.id);
			if (!player) return null;

			const eloChange = eloChanges.find((p) => p.id === dbPlayer.id)?.eloChange || 0;
			const newElo = dbPlayer.elo + eloChange;
			const won = player.won;

			const w = won ? dbPlayer.w + 1 : dbPlayer.w;
			const l = won ? dbPlayer.l : dbPlayer.l + 1;

			const playerGameData = {
				player_id: dbPlayer.id,
				game_id: gameId,
				champion: player.champion,
				role: player.role,
				blue_team: player.team === 'blue',
				kills: player.k,
				deaths: player.d,
				assists: player.a,
				elo_change: eloChange
			};
			const { error: insertError } = await supabase.from('player_game_data').insert(playerGameData);
			if (insertError) throw error(500, 'An error occurred while inserting player game data.');
			const { error: updateError } = await supabase
				.from('players')
				.update({ elo: newElo, w, l })
				.eq('id', playerGameData.player_id);

			if (updateError) throw error(500, 'An error occurred while updating player data.');
		});

		await Promise.all(updatePlayers);

		return new Response('Game results processed successfully.');
	} catch (err) {
		throw error(500, 'Error processing game results.');
	}
}) satisfies RequestHandler;
