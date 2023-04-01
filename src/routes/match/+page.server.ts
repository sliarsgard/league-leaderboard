import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({locals}) => {
	const { supabase } = locals;
	const players = await supabase.from('players').select('*')
	if (!players.data) throw error(500, 'Supabase error')
	return {
		players: players.data.sort((a, b) => {
            if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
            if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
            return 0;
        }),
	};
}) satisfies PageServerLoad;
