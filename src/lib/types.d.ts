import type { Database } from "./database";

export type Role = 'top' | 'jng' | 'mid' | 'bot' | 'sup';

export interface GameDataInput {
	players: PlayerGameDataProp[];
	bans: {
		blue: number[];
		red: number[];
	};
}

export interface PlayerGameDataInput {
	id: number;
	champion: number;
	team: 'blue' | 'red';
	role: Role;
	k: number;
	d: number;
	a: number;
}

export interface PlayerGameDataProp extends PlayerGameDataInput {
	won: boolean;
}

export type PlayerGameData = Database['public']['Tables']['player_game_data']['Row'];
export type PlayerGameDataInsert = Database['public']['Tables']['player_game_data']['Insert'];

export interface Player {
	created_at: string;
	elo: number;
	id: number;
	l: number;
	name: string;
	w: number;
}

export interface Game {
	bans: {
		blue: string[];
		red: string[];
	};
	players: PlayerGameData[];
}
