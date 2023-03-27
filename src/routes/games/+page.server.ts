import { error } from '@sveltejs/kit';
import supabase from '$lib/supabase'
import type { PageServerLoad } from './$types'

export const load = (async () => {
    const games = await supabase.from('games').select('*, player_game_data(*)')
    if (games.error || games.data === null) throw error(500, games.error.message)
    if (games.data.length === 0) throw error(404, 'No games found')
    return { games: games.data }

}) satisfies PageServerLoad