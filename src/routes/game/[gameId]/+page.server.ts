import { error } from '@sveltejs/kit';
import db from '$lib/db';
import type { Game, PlayerGameData } from '$lib/types';
import type { PageServerLoad } from './$types';

export const load = (async ({params}) => {
	const dbGame = await db.collection('games').findOne({id: Number(params.gameId)});
    if (!dbGame) throw error(404, 'Game not found!')
    const {bans, id, players} = dbGame

    const url = 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-summary.json'
    const championData = await fetch(url, {method: 'GET'})
    const champions = await championData.json()

    const champURL = (id: number) => `https://cdn.communitydragon.org/latest/champion/${id}/square`

    interface ChampImage {
        name: string
        url: string
    }

    const champImages: ChampImage[] = players.map((player: PlayerGameData) => {
        const champId = champions.find((c: {name: string}) => c.name === player.champion).id
        const url = champURL(champId)
        return {url, name: player.champion}
    })
	const game: Game = {bans, id, players}

	return {
		game,
        champImages
	};
}) satisfies PageServerLoad;
