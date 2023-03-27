import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import supabase from '$lib/supabase';
import type { PlayerGameData } from '$lib/types';

interface Player extends PlayerGameData {
    players: {
        name: string
    }
}

export const load = (async ({params}) => {
    const gameId = Number(params.gameId)
	const game = await supabase.from('games').select('*, player_game_data(*, players(name))').eq('id', gameId).limit(1,{}).single()
    if (game.error || game.data === null) throw error(500, game.error.message)
    const {bans_blue, bans_red} = game.data
    const players = game.data.player_game_data as Player[]

    if (players === null) throw error(500, 'No players found')
    if (players.length !== 10) throw error(500, 'Not enough players found')

    const url = 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-summary.json'
    const championData = await fetch(url, {method: 'GET'})
    const champions: {id: number}[] = await championData.json()

    const champURL = (id: number) => `https://cdn.communitydragon.org/latest/champion/${id}/square`

    interface ChampImage {
        id: number
        url: string
    }
    
    const champImages: ChampImage[] = players.map((player) => {
        const champId = champions.find((c) => c.id === player.champion)?.id || -1
        const url = champURL(champId)
        return {url, id: player.champion}
    })

    const banChampImages: ChampImage[] = [...bans_blue, ...bans_red].map((champId) => {
        const url = champURL(champId)
        return {url, id: champId}
    })

	return {
		game: game.data,
        players,
        champImages,
        banChampImages
	};
}) satisfies PageServerLoad;
