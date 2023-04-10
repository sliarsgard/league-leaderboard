import type { Champion } from './types/external';

export const getTier = (elo: number) => {
	if (elo >= 1500) {
		return 'Challenger';
	} else if (elo >= 1400) {
		return 'Grandmaster';
	} else if (elo >= 1300) {
		return 'Master';
	} else if (elo >= 1200) {
		return 'Diamond';
	} else if (elo >= 1100) {
		return 'Platinum';
	} else if (elo >= 1000) {
		return 'Gold';
	} else if (elo >= 900) {
		return 'Silver';
	} else if (elo >= 800) {
		return 'Bronze';
	} else {
		return 'Iron';
	}
};

export const getTierNumber = (elo: number) => {
	if (elo >= 1500) {
		return 9;
	} else if (elo >= 1400) {
		return 8;
	} else if (elo >= 1300) {
		return 7;
	} else if (elo >= 1200) {
		return 6;
	} else if (elo >= 1100) {
		return 5;
	} else if (elo >= 1000) {
		return 4;
	} else if (elo >= 900) {
		return 3;
	} else if (elo >= 800) {
		return 2;
	} else {
		return 1;
	}
}

export const getTierUrl = (elo: number, fancy=false) => {
	// const url = 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/'
	const url = fancy ?
	`https://lolg-cdn.porofessor.gg/img/s/league-icons-v3/160/` :
	`https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-mini-crests/`;
	const tier = fancy ? getTierNumber(elo) : getTier(elo).toLowerCase();
	console.log(elo, tier)
	return `${url}${tier}.png`;
};

export const getTierPoints = (elo: number) => {
	elo = Math.floor(elo);
	if (elo >= 1300) {
		return elo - 1500;
	} else if (elo >= 700) {
		return elo % 100;
	} else {
		return elo - 700;
	}
};

export const getChampionImageUrl = (championId: number) =>
	`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${championId}.png`;

export const getIconUrl = (iconId: number) =>
	`https://raw.communitydragon.org/latest/game/assets/ux/summonericons/profileicon${iconId}.png`;

export const getSummonerUrl = (name: string) =>
	`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}`;

export const CHAMPION_SUMMARY_URL =
	'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-summary.json';

/**
 * Fetches the champion data from the external source.
 * @param fetch The fetch function to use.
 * @returns The champion data.
 */
export const getChampionSummary = async (fetch: typeof window.fetch): Promise<Champion[]> => {
	const championData = await fetch(CHAMPION_SUMMARY_URL, { method: 'GET' });
	const champions = await championData.json();
	return champions;
};

