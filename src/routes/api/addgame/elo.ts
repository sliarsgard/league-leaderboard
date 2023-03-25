import db from '$lib/db';
import type { Player } from '$lib/types';

const K_FACTOR = 32;

const expectedOutcome = (rating1: number, rating2: number) => {
	return 1 / (1 + Math.pow(10, (rating2 - rating1) / 400));
};

interface EloChange {
	name: string
	playerEloChange: number
}

export const calculateEloChange = async (winningPlayers: Player[], losingPlayers: Player[]): Promise<EloChange[]> => {
	const pointsWinningTeam = winningPlayers.reduce((acc, curr) => acc + curr?.elo, 0) / 5;
	const pointsLosingTeam = losingPlayers.reduce((acc, curr) => acc + curr?.elo, 0) / 5;

	const updatePointsW = winningPlayers.map(async (player) => {
		const expectedWin = expectedOutcome(player.elo, pointsLosingTeam);
		const playerEloChange = Math.round(K_FACTOR * (1 - expectedWin))
		await db.collection('players').findOneAndUpdate(
			{ name: player?.name },
			{
				$inc: { elo: playerEloChange, w: 1 }
			}
		);
		return {name: player.name, playerEloChange}
	});

	const updatePointsL = losingPlayers.map(async (player) => {
		const expectedWin = expectedOutcome(player.elo, pointsWinningTeam);
		const playerEloChange = Math.round(K_FACTOR * (0 - expectedWin))
		await db.collection('players').findOneAndUpdate(
			{ name: player?.name },
			{
				$inc: { elo: playerEloChange, l: 1 }
			}
		);
		return {name: player.name, playerEloChange}
	});

	return await Promise.all([...updatePointsW, ...updatePointsL]);
};
