import db from '$lib/db'
import type { PageServerLoad } from '../$types'

export const load = (async ({params}) => {
    //@ts-expect-error I don't know
    const playerName = params.player
    const dbPlayer = await db.collection('players').findOne({name: playerName})
    if (!dbPlayer) return 
    const {name, points, w, l} = dbPlayer
    const player = {
        name,
        points,
        w,
        l
    }

    return {
        player,
    }
}) satisfies PageServerLoad