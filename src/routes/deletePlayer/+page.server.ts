import supabase from '$lib/supabase';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	const players = await supabase.from('players').select('name, id')
	if (!players.data) throw error(500, 'Supabase error')
	return {
		players: players.data,
	};
}) satisfies PageServerLoad;
