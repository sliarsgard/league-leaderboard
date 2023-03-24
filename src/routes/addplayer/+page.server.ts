import db from '$lib/db'
import type { PageServerLoad } from './$types'

export const load = (async () => {
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

    return {
        players,
    }
}) satisfies PageServerLoad