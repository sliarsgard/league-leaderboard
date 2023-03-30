import supabase from '$lib/supabase';
import type { Game, Player, PlayerGameData } from '$lib/types';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

interface PlayerPageGameData extends PlayerGameData {
    games: Game
}
interface Champion {
    id: number
    name: string
    alias: string
    squarePortraitPath: string
}
interface ReturnType {
    champions: Champion[]
    player: Player
    playerGameData: PlayerPageGameData[]
}

export const load = (async ({ params }): Promise<ReturnType> => {
	const playerId = parseInt(params.playerId);
	if (isNaN(playerId)) throw error(404, 'Player not found');
	const player = await supabase.from('players').select('*').eq('id', playerId).single();
	if (!player.data) throw error(404, 'Player not found');
    const playerGameData = await supabase.from('player_game_data').select('*, games(*)').eq('player_id', playerId).returns<PlayerPageGameData[]|PlayerGameData>().limit(1, {foreignTable: 'games'})

    const url = 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-summary.json'
    const championData = await fetch(url, {method: 'GET'})
    const champions = await championData.json()
    
    //@ts-expect-error - this is a bug in the supabase typings
    console.log(playerGameData.length)
    if (playerGameData.data === null)
        return { champions, player: player.data, playerGameData: []}
        //@ts-expect-error - this is a bug in the supabase typings
    else if (!playerGameData.data.length)
        return { champions, player: player.data, playerGameData: [playerGameData.data as PlayerPageGameData]}
	return { champions, player: player.data, playerGameData: playerGameData.data as PlayerPageGameData[] };
}) satisfies PageServerLoad;
