import db from '$lib/db';
import type { RequestHandler } from './$types';
import type { Player } from '$lib/player';

const DEFAULT_POINT_GAIN = 25;

export const POST = (async ({ request }) => {

	// db.collection('players').updateMany({}, {
	// 	$set: {
	// 		points: 0,
	// 		w: 0,
	// 		l: 0
	// 	}
	// })
	// return new Response();


	const { winningTeamNames, losingTeamNames } = await request.json();

	const getWinningTeam = winningTeamNames.map((name: string) =>
		db.collection('players').findOne({ name })
	);
	const getLosingTeam = losingTeamNames.map((name: string) =>
		db.collection('players').findOne({ name })
	);
	const winningTeam = await Promise.all(getWinningTeam);
	const losingTeam = await Promise.all(getLosingTeam);

	const pointsWinningTeam = winningTeam.reduce((acc, curr) => acc + curr.points, 0) / 5;
	const pointsLosingTeam = losingTeam.reduce((acc, curr) => acc + curr.points, 0) / 5;
	const teamDiff = (pointsWinningTeam - pointsLosingTeam) / DEFAULT_POINT_GAIN;

	const pointsGain = DEFAULT_POINT_GAIN * (sigmoid(teamDiff / 25) + 0.5);

	const updatePointsW = winningTeam.map((player: Player) => {
		const diff = pointsWinningTeam - player.points;
		const playerPointsGain = Math.round(pointsGain * (sigmoid(diff / 100) + 0.5));
		return db.collection('players').findOneAndUpdate(
			{ name: player.name },
			{
				$inc: { points: playerPointsGain, w: 1 }
			}
		);
	});
	await Promise.all(updatePointsW);
	const updatePointsL = losingTeam.map((player: Player) => {
		const diff = player.points - pointsLosingTeam;
		const playerPointsGain = -Math.round(pointsGain * (sigmoid(diff / 100) + 0.5));
		return db.collection('players').findOneAndUpdate(
			{ name: player.name },
			{
				$inc: { points: playerPointsGain, l: 1 }
			}
		);
	});
	await Promise.all(updatePointsL);

	return new Response();
}) satisfies RequestHandler;

const sigmoid = (x: number) => Math.pow(Math.E, x) / (Math.pow(Math.E, x) + 1);
