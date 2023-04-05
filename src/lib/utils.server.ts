import { RIOT_API_KEY } from '$env/static/private';
import type { Player } from './types/database';
import type { PlayerWithIcon } from './types/extended';
import type { Summoner } from './types/external';
import { getSummonerUrl } from './util';

/**
 * Fetches the summoner data from from the Riot API.
 * @param name The name of the summoner.
 * @param fetch The fetch function to use.
 * @returns The summoner data.
 * @see https://developer.riotgames.com/apis#summoner-v4/GET_getBySummonerName
 */
export const getSummonerData = async (
	name: string,
	fetch: typeof window.fetch
): Promise<Summoner> => {
	const summonerData = await fetch(getSummonerUrl(name), {
		method: 'GET',
		headers: { 'X-Riot-Token': RIOT_API_KEY }
	});
	const summoner: Summoner = await summonerData.json();
	return summoner;
};

/**
 * Fetches the summoner icon from the Riot API.
 * @param player The player to fetch the icon for.
 * @param fetch The fetch function to use.
 * @returns The player with the icon.
 */
export const getPlayerWithIcon = async (
	player: Player,
	fetch: typeof window.fetch
): Promise<PlayerWithIcon> => {
	const summoner = await getSummonerData(player.name, fetch);
	return { ...player, profileIconId: summoner.profileIconId };
};

/**
 * Fetches the summoner icon from the Riot API.
 * @param players The players to fetch the icons for.
 * @param fetch The fetch function to use.
 * @returns The players with the icons.
 */
export const getPlayersWithIcon = async (
	players: Player[],
	fetch: typeof window.fetch
): Promise<PlayerWithIcon[]> => {
	const playerIconsPromise = players.map((player) => getPlayerWithIcon(player, fetch));
	const playerImages = await Promise.all(playerIconsPromise);
	return playerImages;
};
