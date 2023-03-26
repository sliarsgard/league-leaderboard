import db from '$lib/db';
import type { GameDataInput, Player } from '$lib/types';
import { calculateEloChange } from './elo';
import type { RequestHandler } from './$types';

export const POST = (async ({ request }) => {
	try {
		const { players, bans }: GameDataInput = await request.json();
		const findPlayers = players.map((player) =>
			db.collection('players').findOne({ name: player.name })
		);
		const dbPlayers = await Promise.all(findPlayers);
		if (dbPlayers.includes(null)) {
			return new Response('Some players were not found in the database.', { status: 400 });
		}
		const winningPlayers = dbPlayers.filter(
			(player) => players.find((p) => p.name === player?.name)?.won
		);
		const losingPlayers = dbPlayers.filter(
			(player) => !players.find((p) => p.name === player?.name)?.won
		);
		const eloChanges = await calculateEloChange(
			toPlayers(winningPlayers),
			toPlayers(losingPlayers)
		);

		if (winningPlayers.includes(null) || losingPlayers.includes(null)) {
			return new Response('Some players were not found in the database.', { status: 400 });
		}

		db.collection('games').insertOne({
			bans,
			players: players.map((player) => {
				const dbPlayer = dbPlayers.find((p) => p?.name === player.name);
				const eloChange = eloChanges.find((p) => p.name === player.name)?.playerEloChange;
				return {
					name: player.name,
					champion: player.champion,
					team: player.team,
					role: player.role,
					k: player.k,
					d: player.d,
					a: player.a,
					won: player.won,
					prevElo: dbPlayer?.elo ?? 1000 - (eloChange ?? 0),
					eloChange
				};
			})
		});
		return new Response('Game results processed successfully.', { status: 200 });
	} catch (error) {
		console.error('Error processing game results:', error);
		return new Response('An error occurred while processing game results.', { status: 500 });
	}
}) satisfies RequestHandler;

const toPlayers = (dbPlayers: any[]): Player[] => {
	return dbPlayers.map((p) => ({
		elo: p.elo,
		w: p.w,
		l: p.l,
		name: p.name
	}));
};
