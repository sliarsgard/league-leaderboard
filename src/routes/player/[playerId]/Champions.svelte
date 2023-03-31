<script lang="ts">
	import type { Champion } from '$lib/types';
	import { getContext } from 'svelte';
	import type { PlayerPageGameData } from './+page.server';

	export let playerGameData: PlayerPageGameData[];

	interface ChampionData {
		wins: number;
		losses: number;
		kills: number;
		deaths: number;
		assists: number;
		id: number;
		name: string;
	}

	const champions = getContext<Champion[]>('champions');
	const playedChampions = playerGameData
		.map((gameData) => {
			const champion = champions.find((champ) => champ.id === gameData.champion);
			const won =
				(gameData.games.blue_team_win && gameData.blue_team) ||
				(!gameData.games.blue_team_win && !gameData.blue_team);
			return {
				wins: won ? 1 : 0,
				losses: won ? 0 : 1,
				kills: gameData.kills,
				deaths: gameData.deaths,
				assists: gameData.assists,
				id: champion ? champion.id : -1,
				name: champion ? champion.name : 'Unknown'
			};
		})
		.reduce((acc, cur) => {
			const champion = acc.find((champ) => champ.name === cur.name);
			if (champion) {
				champion.wins += cur.wins;
				champion.losses += cur.losses;
				champion.kills += cur.kills;
				champion.deaths += cur.deaths;
				champion.assists += cur.assists;
			} else {
				acc.push(cur);
			}
			return acc;
		}, [] as ChampionData[]).sort((a,b) => b.wins - a.wins).sort((a, b) => {
            const aGames = a.wins + a.losses;
            const bGames = b.wins + b.losses;
            return bGames - aGames;
        })
        
	const getChampionName = (id: number) => {
		const champion = champions.find((champ) => champ.id === id);
		return champion ? champion.name : 'Unknown';
	};

	const getKDA = (champion: ChampionData) => {
		const games = champion.wins + champion.losses;
		const avgKills = champion.kills / games;
		const avgDeaths = champion.deaths / games;
		const avgAssists = champion.assists / games;
		return `${avgKills.toFixed(1)} / ${avgDeaths.toFixed(1)} / ${avgAssists.toFixed(1)}`;
	};
</script>

<div
	class="bg-slate-500 border-b-4 border-fuchsia-400 text-xl uppercase text-fuchsia-400 rounded-md font-bold p-4"
>
	<span>Champions</span>
</div>
<div class="flex flex-col gap-2">
	{#each playedChampions as champion}
		<div class="bg-slate-500 p-2 rounded-md flex gap-2 align-middle text-slate-800 text-sm font-semibold">
			<img
				src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${champion.id}.png`}
				alt={getChampionName(champion.id)}
				class="w-10 h-10 object-cover"
			/>
			<div class="flex justify-between w-full">
				<div class="flex flex-col justify-center">
					<span class="font-bold">{champion.name}</span>
					<span>{getKDA(champion)}</span>
				</div>
				<div class="flex flex-col justify-center text-right">
					<span>{`${champion.wins + champion.losses} ${champion.wins + champion.losses === 1 ? 'game' : 'games'}`}</span>
					<span>{`${(champion.wins/(champion.wins + champion.losses)*100).toFixed(1)}%`}</span>
				</div>
			</div>
		</div>
	{/each}
</div>
