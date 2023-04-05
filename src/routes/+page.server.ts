import { error } from '@sveltejs/kit';
import {RIOT_API_KEY} from '$env/static/private'
import type { PageServerLoad } from './$types'
import { getSummonerUrl } from '$lib/util';

export const load = (async ({locals}) => {
    const {supabase} = locals
    const playerDataRes = await supabase.from('players').select('*').order('elo', {ascending: false})
    if (playerDataRes.error || playerDataRes.data === null) throw error(500, playerDataRes.error.message)
    const playerData = playerDataRes.data.filter(player => player.wins + player.losses > 0)
    const getPlayerImages = playerData.map(async (player) => {
        const summonerData = await fetch(getSummonerUrl(player.name), {
            headers: { 'X-Riot-Token': RIOT_API_KEY }
        })
        const summoner = await summonerData.json()
        return {
            ...player,
            profileIconId: summoner.profileIconId
        }
    })
    const players = (await Promise.all(getPlayerImages)).sort((a, b) => b.elo - a.elo)

    return {players}
}) satisfies PageServerLoad