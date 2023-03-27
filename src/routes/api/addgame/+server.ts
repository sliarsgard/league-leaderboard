// import db from '$lib/db';
import type { GameDataInput, Player } from '$lib/types';
import { calculateEloChange } from './elo';
import type { RequestHandler } from './$types';
import supabase from '$lib/supabase';

export const POST = (async ({ request }) => {
	try {
		const { players, bans }: GameDataInput = await request.json();
		const dbPlayers = (await supabase.from('players').select('*').filter('name', 'in', players.map(p => p.id))).data

		if (!dbPlayers) {
			return new Response('Some players were not found in the database.', { status: 400 });
		}
		const winningPlayers: Player[] = dbPlayers.filter(
			(player) => players.find((p) => p.id === player.id)?.won
		);
		const losingPlayers: Player[] = dbPlayers.filter(
			(player) => !players.find((p) => p.id === player.id)?.won
		);
		const eloChanges = await calculateEloChange(
			winningPlayers,
			losingPlayers
		);

		const game = await supabase.from('games').insert({
			bans_blue: bans.blue,
			bans_red: bans.red,
		}).select('*').single()
		
		const updatePlayers = dbPlayers.map(dbPlayer => {
			const player = players.find(p => p.id === dbPlayer.id)
			if (!player) return null
			return supabase.from('player_game_data').insert({
				player: dbPlayer.id,
				champion: player.champion,
				role: player.role,
				blue_team: player.team === 'blue',
				kills: player.k,
				deaths: player.d,
				assists: player.a,
				id: game.data?.id,
				elo_change: eloChanges.find(p => p.id === dbPlayer.id)?.eloChange
			})
		})
		await Promise.all(updatePlayers)
			
		return new Response('Game results processed successfully.', { status: 200 });
	} catch (error) {
		console.error('Error processing game results:', error);
		return new Response('An error occurred while processing game results.', { status: 500 });
	}
}) satisfies RequestHandler;
