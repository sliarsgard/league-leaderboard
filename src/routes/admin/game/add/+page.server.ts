import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getChampionSummary } from '$lib/util';
import { getPlayersWithIcon } from '$lib/utils.server';

export const load: PageServerLoad = async ({ fetch, locals }) => {
	// Check if user is logged in
	const { supabase, getSession } = locals;
	const session = await getSession();
	if (!session) throw redirect(307, '/login');

	// Get players from database
	const dbPlayers = await supabase.from('players').select('*');
	if (dbPlayers.error) throw error(404, 'No players found');

	// Get champions and player icons from the Riot API
	const champions = await getChampionSummary(fetch);
	const players = await getPlayersWithIcon(dbPlayers.data, fetch);

	return { players, champions };
};
