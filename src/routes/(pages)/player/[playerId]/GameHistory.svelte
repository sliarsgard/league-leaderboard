<script lang="ts">
	import { getContext } from 'svelte';
	import type { PlayerPageGameData } from './+page.server';
	import type { Champion } from '$lib/types/external';

    export let playerGameData: PlayerPageGameData[]
	const champions = getContext<Champion[]>('champions');

	const getChampionName = (id: number) => {
		const champion = champions.find((champ) => champ.id === id);
		return champion ? champion.name : 'Unknown';
	};
	const roleNames: Record<string, string> = {
		top: 'Top',
		jng: 'Jungle',
		mid: 'Mid',
		bot: 'ADC',
		sup: 'Support'
	};
</script>

<div
	class="bg-slate-500 border-b-4 border-amber-500 text-amber-500 text-xl rounded-md font-bold uppercase p-4"
>
	<span>Game History</span>
</div>
{#each playerGameData as gameData}
	<a
		data-sveltekit-preload-data
		href={`/game/${gameData.game_id}`}
		class="flex items-center gap-4 bg-slate-500 rounded-md p-4 w-full border-l-4 hover:bg-slate-400 active:bg-slate-300"
		class:win-border={gameData.elo_change >= 0}
		class:lose-border={gameData.elo_change < 0}
	>
		<div class="w-16">
			<img
				src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${gameData.champion}.png`}
				alt={getChampionName(gameData.champion)}
				class="w-12 h-12 object-cover rounded-full"
			/>
		</div>
		<div class="flex flex-col w-full">
			<div class="flex justify-between">
				<div class="font-bold">{getChampionName(gameData.champion)}</div>
				<div class="font-bold">
					{`${gameData.kills}/${gameData.deaths}/${gameData.assists}`}
				</div>
			</div>
			<div class="flex justify-between">
				<div class="font-bold">{roleNames[gameData.role] || gameData.role}</div>
				<div
					class="col-span-3 font-bold"
					class:win={gameData.elo_change >= 0}
					class:lose={gameData.elo_change < 0}
				>
					{gameData.elo_change >= 0 ? `+${gameData.elo_change}` : gameData.elo_change} elo
				</div>
			</div>
		</div>
	</a>
{/each}

<style lang="postcss">
	.win {
		@apply text-lime-400;
	}
	.lose {
		@apply text-rose-400;
	}
	.win-border {
		@apply border-lime-400;
	}
	.lose-border {
		@apply border-rose-400;
	}
</style>
