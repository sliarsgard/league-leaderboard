import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Champion, PlayerWithIcon } from '$lib/types';
import { RIOT_API_KEY } from '$env/static/private';
import { getSummonerUrl } from '$lib/util';

interface ReturnType {
    players: PlayerWithIcon[];
    champions: Champion[]
}

export const load = (async ({ fetch, locals }): Promise<ReturnType> => {
	const { supabase, getSession } = locals;
	const session = await getSession();
	if (!session) throw redirect(307, '/login')
	
	const dbPlayers = await supabase.from('players').select('*');
	if (dbPlayers.error) throw error(404, 'No players found');
	const url =
		'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-summary.json';
	const championData = await fetch(url, { method: 'GET' });
	const champions = await championData.json();

	const getPlayerImages = dbPlayers.data.map(async (player) => {
        const summonerData = await fetch(getSummonerUrl(player.name), {
            headers: { 'X-Riot-Token': RIOT_API_KEY }
        })
        const summoner = await summonerData.json()
        return {
            ...player,
            profileIconId: summoner.profileIconId
        }
    })
	const players = (await Promise.all(getPlayerImages)).sort((a, b) => b.elo - a.elo);

	return {
		players,
		champions
	};
}) satisfies PageServerLoad;
