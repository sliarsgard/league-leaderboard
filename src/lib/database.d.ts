export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
	public: {
		Tables: {
			games: {
				Row: {
					blue_team_win: boolean;
					bans_blue: number[];
					bans_red: number[];
					created_at: string;
					id: number;
				};
				Insert: {
					blue_team_win: boolean;
					bans_blue: number[];
					bans_red: number[];
				};
				Update: {
					blue_team_win?: boolean;
					bans_blue?: number[];
					bans_red?: number[];
				};
			};
			player_game_data: {
				Row: {
					assists: number;
					blue_team: boolean;
					champion: number;
					created_at: string;
					deaths: number;
					elo_change: number;
					game_id: number;
					player_id: number;
					kills: number;
					role: string;
				};
				Insert: {
					assists: number;
					blue_team: boolean;
					champion: number;
					deaths: number;
					elo_change: number;
					game_id: number;
					player_id: number;
					kills: number;
					role: string;
				};
				Update: {
					assists?: number;
					blue_team?: boolean;
					champion?: number;
					deaths?: number;
					elo_change?: number;
					kills?: number;
					role?: string;
				};
			};
			players: {
				Row: {
                    created_at: string;
                    elo: number;
                    id: number;
                    name: string;
                    w: number;
                    l: number;
                };
				Insert: {
                    name: string;
                };
				Update: {
                    elo?: number;
                    name?: string;
                    w?: number;
                    l?: number;
                };
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
}
