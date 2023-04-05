import type { Database } from "./supabase";

// export interface GameDataInput {
// 	players: PlayerGameDataProp[];
// 	bans: {
// 		blue: number[];
// 		red: number[];
// 	};
// }

// export interface PlayerGameDataInput {
// 	id: number;
// 	champion: number;
// 	team: 'blue' | 'red';
// 	role: Role;
// 	k: number;
// 	d: number;
// 	a: number;
// }

// export interface PlayerGameDataProp extends PlayerGameDataInput {
// 	won: boolean;
// }

// Database types
export type Game = Database['public']['Tables']['games']['Row']; 
export type GameInsert = Database['public']['Tables']['games']['Insert'];
export type Player = Database['public']['Tables']['players']['Row']; 
export type PlayerGameData = Database['public']['Tables']['player_game_data']['Row'];
export type PlayerGameDataInsert = Database['public']['Tables']['player_game_data']['Insert'];

// Extended database types


// External fetch types
