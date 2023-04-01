import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Champion } from '$lib/types';

interface ReturnType {
    players: {
        name: string;
        elo: number;
        id: number;
    }[];
    champions: Champion[]
}

export const load = (async ({ fetch, locals }): Promise<ReturnType> => {
	const { supabase, getSession } = locals;
	const session = await getSession();
	if (!session) throw redirect(307, '/login')
	
	const dbPlayers = await supabase.from('players').select('name, elo, id');
	if (dbPlayers.error) throw error(404, 'No players found');
	const url =
		'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-summary.json';
	const championData = await fetch(url, { method: 'GET' });
	const champions = await championData.json();

	return {
		players: dbPlayers.data,
		champions
	};
}) satisfies PageServerLoad;
