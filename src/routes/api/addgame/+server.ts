import db from '$lib/db';
import type { Game } from '$lib/types';
import { calculateEloChange } from "./elo";
import type { RequestHandler } from './$types';

export const POST = (async ({ request }) => {
	try {
		const { winningTeam: winningTeamData, losingTeam: losingTeamData }: Game = await request.json();
		const winningTeamNames = winningTeamData.map((p) => p.name);
		const losingTeamNames = losingTeamData.map((p) => p.name);

		const findWinningPlayers = winningTeamNames.map((name: string) =>
			db.collection('players').findOne({ name })
		);
		const findLosingPlayers = losingTeamNames.map((name: string) =>
			db.collection('players').findOne({ name })
		);
		const winningPlayers = await Promise.all(findWinningPlayers);
		const losingPlayers = await Promise.all(findLosingPlayers);

		if (winningPlayers.includes(null) || losingPlayers.includes(null)) {
			return new Response('Some players were not found in the database.', { status: 400 });
		}

		//@ts-expect-error mdb types
		const eloChanges = await calculateEloChange(winningPlayers, losingPlayers);

		db.collection('games').insertOne({
			winningTeam: winningTeamData.map((player) => {
				return {
					...player,
					eloChange: Math.round(Number(eloChanges.find((p) => p.name === player.name)))
				};
			}),
			losingTeam: losingTeamData.map((player) => {
				return {
					...player,
					eloChange: Math.round(Number(eloChanges.find((p) => p.name === player.name)))
				};
			})
		});
		return new Response('Game results processed successfully.', { status: 200 });
	} catch (error) {
		console.error('Error processing game results:', error);
		return new Response('An error occurred while processing game results.', { status: 500 });
	}
}) satisfies RequestHandler;
