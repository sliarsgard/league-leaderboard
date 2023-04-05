/**
 * This file contains all the interfaces that are used to describe the data
 * that is fetched from external sources.
 */

/**
 * The data returned from the champion-summary.json file.
 * This file contains all the champion data.
 * @see https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-summary.json
 */
export interface Champion {
	id: number;
	name: string;
	alias: string;
	squarePortraitPath: string;
}

/**
 * The data returned from the summoner-v4 endpoint.
 * This file contains all the summoner data.
 * @see https://developer.riotgames.com/apis#summoner-v4/GET_getBySummonerName
 */
export interface Summoner {
    id: string;
    accountId: string;
    puuid: string;
    name: string;
    profileIconId: number;
    revisionDate: number;
    summonerLevel: number;
}
