import db from '$lib/db';
import type { Player } from '$lib/types';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	const dbPlayers = await db.collection('players').find().toArray();
	const players: Player[] = dbPlayers.map((player) => {
		const { name, elo, w, l } = player;
		return { name, elo, w, l };
	});

	return {
		players
	};
}) satisfies PageServerLoad;
