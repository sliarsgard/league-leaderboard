import { error } from '@sveltejs/kit';
import {RIOT_API_KEY} from '$env/static/private'
import type { PageServerLoad } from './$types'

const getSummonerUrl = (name: string) => `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}`

export const load = (async ({locals}) => {
    const {supabase} = locals
    const playerData = await supabase.from('players').select()
    if (playerData.error || playerData.data === null) throw error(500, playerData.error.message)
    const getPlayerImages = playerData.data.map(async (player) => {
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