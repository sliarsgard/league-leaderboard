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

export type Game = Database['public']['Tables']['games']['Row']; 
export type Player = Database['public']['Tables']['players']['Row']; 
export type PlayerGameData = Database['public']['Tables']['player_game_data']['Row'];
export type PlayerGameDataInsert = Database['public']['Tables']['player_game_data']['Insert'];

