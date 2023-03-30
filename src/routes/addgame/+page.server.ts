import { error } from '@sveltejs/kit';
import supabase from '$lib/supabase'
import type { PageServerLoad } from './$types'

export const load = (async ({fetch}) => {
    const dbPlayers = await supabase.from('players').select('name, elo, id')
    if (!dbPlayers.data) throw error(404, 'No players found')
    const url = 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-summary.json'
    const championData = await fetch(url, {method: 'GET'})
    const champions = await championData.json()
    
    return {
        players: dbPlayers.data,
        champions
    }
}) satisfies PageServerLoad