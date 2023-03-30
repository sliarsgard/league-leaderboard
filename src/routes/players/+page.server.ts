import supabase from '$lib/supabase';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	const players = await supabase.from('players').select('*')
	if (!players.data) throw error(500, 'Supabase error')
	return {
		players: players.data.sort((a,b) => {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
        }),
	};
}) satisfies PageServerLoad;
