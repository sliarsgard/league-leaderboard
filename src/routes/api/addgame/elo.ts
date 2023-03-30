import type { Player } from '$lib/types';

const K_FACTOR = 64;

const expectedOutcome = (rating1: number, rating2: number) => {
	return 1 / (1 + Math.pow(10, (rating2 - rating1) / 400));
};

interface EloChange {
	id: number;
	eloChange: number;
}

export const calculateEloChange = async (
	winningPlayers: Player[],
	losingPlayers: Player[]
): Promise<EloChange[]> => {
	const pointsWinningTeam = winningPlayers.reduce((acc, curr) => acc + curr.elo, 0) / 5;
	const pointsLosingTeam = losingPlayers.reduce((acc, curr) => acc + curr.elo, 0) / 5;

	const updatePointsW = winningPlayers.map((player) => {
		const expectedWin = expectedOutcome(player.elo, pointsLosingTeam);
		const eloChange = Math.round(K_FACTOR * (1 - expectedWin));
		return { id: player.id, eloChange };
	});

	const updatePointsL = losingPlayers.map((player) => {
		const expectedWin = expectedOutcome(player.elo, pointsWinningTeam);
		const eloChange = Math.round(K_FACTOR * (0 - expectedWin));
		return { id: player.id, eloChange };
	});

	return [...updatePointsW, ...updatePointsL];
};
