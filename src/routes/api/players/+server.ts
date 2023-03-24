import db from '$lib/db'
import type { RequestHandler } from './$types';

export const GET = (async () => {
    const dbPlayers = await db.collection('players').find().toArray()
    const players = dbPlayers.map(player => {
        const {name, points, w, l} = player
        return {
            name,
            points,
            w,
            l
        }
    })
	return new Response(JSON.stringify(players));
}) satisfies RequestHandler