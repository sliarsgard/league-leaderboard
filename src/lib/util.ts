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

export const getTierUrl = (elo: number) => {
	// const url = 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/'
	const url = `https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-mini-crests/`;
	const tier = getTier(elo).toLowerCase();
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
