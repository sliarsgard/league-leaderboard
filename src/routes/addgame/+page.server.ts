import db from '$lib/db'
import type { Player } from '$lib/types'
import type { PageServerLoad } from './$types'

export const load = (async ({fetch}) => {
    const dbPlayers = await db.collection('players').find().toArray()
    const url = 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-summary.json'
    const championData = await fetch(url, {method: 'GET'})
    const champions = await championData.json()
    const players: Player[] = dbPlayers.map(player => {
        const {name, elo, w, l} = player
        return {
            name,
            elo,
            w,
            l
        }
    })

    return {
        players,
        champions
    }
}) satisfies PageServerLoad