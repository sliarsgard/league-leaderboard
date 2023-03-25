import db from '$lib/db'
import type { Game } from '$lib/types'
import type { PageServerLoad } from './$types'

export const load = (async () => {
    const dbGames = await db.collection('games').find().toArray()
    const games: Game[] = dbGames.map(game => {
        const {winningTeam, losingTeam} = game
        return {
            winningTeam,
            losingTeam
        }
    })

    return {
        games,
    }
}) satisfies PageServerLoad