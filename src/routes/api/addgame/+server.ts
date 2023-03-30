import { error } from '@sveltejs/kit';
import type { GameDataInput, PlayerGameDataInsert } from '$lib/types';
import { calculateEloChange } from './elo';
import type { RequestHandler } from './$types';
import supabase from '$lib/supabase';

export const POST: RequestHandler = (async ({request}) => {
	try {
		const { players, bans }: GameDataInput = await request.json();
		const playerIds = players.map((p) => p.id);
		const dbPlayers = await fetchPlayers(playerIds);
		if (dbPlayers.length !== playerIds.length)
			return new Response('Some players were not found in the database.', { status: 400 });

		const eloChanges = await calculateEloChange(
			dbPlayers.filter((player) => players.find((p) => p.id === player.id)?.won),
			dbPlayers.filter((player) => !players.find((p) => p.id === player.id)?.won)
		);
		const gameId = await createGame(bans, players.find((p) => p.won)?.team === 'blue');

		const updatePlayers = dbPlayers.map((dbPlayer) => {
			const player = players.find((p) => p.id === dbPlayer.id);
			if (!player) return null;

			const eloChange = eloChanges.find((p) => p.id === dbPlayer.id)?.eloChange || 0;
			const newElo = dbPlayer.elo + eloChange;
			const won = player.won;

			const w = won ? dbPlayer.w + 1 : dbPlayer.w;
			const l = won ? dbPlayer.l : dbPlayer.l + 1;
			return insertPlayerGameData({
				player_id: dbPlayer.id,
				game_id: gameId,
				champion: player.champion,
				role: player.role,
				blue_team: player.team === 'blue',
				kills: player.k,
				deaths: player.d,
				assists: player.a,
				elo_change: eloChange,
			}, newElo, w, l);
		});

		await Promise.all(updatePlayers);

		return new Response('Game results processed successfully.')
	} catch (err) {
		throw error(500, 'Error processing game results.');
	}
}) satisfies RequestHandler;

const fetchPlayers = async (playerIds: number[]) => {
	const response = await supabase.from('players').select('*').in('id', playerIds);
	if (response.error) throw error(500, 'An error occurred while fetching players.');
	return response.data;
};

const createGame = async (
	bans: Record<'blue' | 'red', number[]>,
	blueTeamWin: boolean
): Promise<number> => {
	const response = await supabase
		.from('games')
		.insert({
			bans_blue: bans.blue,
			bans_red: bans.red,
			blue_team_win: blueTeamWin
		})
		.select('*')
		.single();

	if (response.error) throw error(500, 'An error occurred while creating game.');
	return response.data.id;
};

async function insertPlayerGameData(playerGameData: PlayerGameDataInsert, elo: number, w: number, l: number): Promise<void> {
	const { error: insertError } = await supabase.from('player_game_data').insert(playerGameData);
	if (insertError) throw error(500, 'An error occurred while inserting player game data.');

	const { error: updateError } = await supabase
		.from('players')
		.update({elo,w,l})
		.eq('id', playerGameData.player_id);

	if (updateError) throw error(500, 'An error occurred while updating player data.');
}