import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import supabase from '$lib/supabase';
import type { Champion, PlayerGameData } from '$lib/types';

interface Player extends PlayerGameData {
    players: {
        name: string
    }
}

export const load = (async ({params}) => {
    const gameId = parseInt(params.gameId)
	if (isNaN(gameId)) throw error(404, 'Player not found');
    const game = await supabase.from('games').select('*').eq('id', gameId).single()
    if (game.error || game.data === null) throw error(500, game.error.message)
    const players = await supabase.from('player_game_data').select('*, players(name)').eq('game_id', gameId).returns<Player[]>()
    if (players.error || players.data === null) throw error(500, players.error.message)
    if (players.data.length !== 10) throw error(500, 'Not enough players found')

    const url = 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-summary.json'
    const championData = await fetch(url, {method: 'GET'})
    const champions: Champion[] = await championData.json()
    
	return {
		game: game.data,
        players: players.data,
        champions
	};
}) satisfies PageServerLoad;
