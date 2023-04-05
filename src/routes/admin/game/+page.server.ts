import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Game, Player, PlayerGameData } from '$lib/types';

interface GameData extends Game {
    player_game_data: PlayerGameData[];
}

interface ReturnType {
    players: Player[];
    games: GameData[];
}

export const load = (async ({ locals }): Promise<ReturnType> => {
	const { supabase, getSession } = locals;
	const session = await getSession();
	if (!session) throw redirect(307, '/login')
	
    const players = await supabase.from('players').select('*')
    if (players.error) throw error(500, 'Supabase error')

	const games = await supabase
		.from('games')
		.select('*, player_game_data(*)')
        .returns<GameData[]>()
		.order('created_at', { ascending: false });
    if (games.error) throw error(500, 'Supabase error')

	return {
		players: players.data,
        games: games.data
	};
}) satisfies PageServerLoad;
