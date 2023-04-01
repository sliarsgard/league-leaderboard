import type { Player } from '$lib/types';

const K_FACTOR = 64;

const expectedOutcome = (rating1: number, rating2: number) =>
	1 / (1 + Math.pow(10, (rating2 - rating1) / 400));

export const calculateEloChange = async (
	winningPlayers: Player[],
	losingPlayers: Player[]
): Promise<EloChange[]> => {
	const sumElo = (acc: number, curr: Player) => acc + curr.elo;
	const pointsWinningTeam = winningPlayers.reduce(sumElo, 0) / 5;
	const pointsLosingTeam = losingPlayers.reduce(sumElo, 0) / 5;

	const eloChanges = (team: Player[], pointsTeam: number, pointsOpposingTeam: number, outcome: number) => {
		return team.map((player) => {
			const adjustedElo = (player.elo + pointsTeam) / 2;
			const expectedWin = expectedOutcome(adjustedElo, pointsOpposingTeam);
			const eloChange = Math.round(K_FACTOR * (outcome - expectedWin));
			return { id: player.id, eloChange };
		});
	}
		
	const updatePointsW = eloChanges(winningPlayers, pointsWinningTeam, pointsLosingTeam, 1);
	const updatePointsL = eloChanges(losingPlayers, pointsLosingTeam, pointsWinningTeam, 0);

	return [...updatePointsW, ...updatePointsL];
};

interface EloChange {
	id: number;
	eloChange: number;
}
