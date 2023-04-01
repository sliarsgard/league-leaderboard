import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types'

export const load = (async ({locals}) => {
    const {supabase} = locals
    const playerData = await supabase.from('players').select()
    if (playerData.error || playerData.data === null) throw error(500, playerData.error.message)
    const players = playerData.data.sort((a, b) => b.elo - a.elo)

    return {players}
}) satisfies PageServerLoad