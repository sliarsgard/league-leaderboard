import type { Player } from "./database";

/**
 * A player with their profile icon ID.
 */
export interface PlayerWithIcon extends Player {
	profileIconId: number;
}