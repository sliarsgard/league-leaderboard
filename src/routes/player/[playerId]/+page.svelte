<script lang="ts">
	import type { PageData } from './$types';
	import { Line } from 'svelte-chartjs';
	import { Chart, registerables } from 'chart.js';

	Chart.register(...registerables);

	export let data: PageData;
	const { champions, player, playerGameData, chart, playedWithPlayers } = data;
	console.log('playerGameData Client', playerGameData);

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

	let sortedListOfPlayers = playedWithPlayers;

	let curretSort = 'games-desc';
	const sortByGamesPlayed = () => {
		if (curretSort === 'games-desc') {
			sortedListOfPlayers = playedWithPlayers.sort((a, b) => a.games - b.games);
			curretSort = 'games-asc';
		} else {
			sortedListOfPlayers = playedWithPlayers.sort((a, b) => b.games - a.games);
			curretSort = 'games-desc';
		}
	};

	const sortByWinrate = () => {
		if (curretSort === 'winrate-desc') {
			sortedListOfPlayers = playedWithPlayers.sort((a, b) => a.wins / a.games - b.wins / b.games);
			curretSort = 'winrate-asc';
		} else {
			sortedListOfPlayers = playedWithPlayers.sort((a, b) => b.wins / b.games - a.wins / a.games);
			curretSort = 'winrate-desc';
		}
	};
</script>

<div class="flex gap-16 mb-8">
	<div class="flex flex-col gap-4 w-[20rem]">
		<div
			class="bg-slate-500 border-b-4 border-cyan-500 text-2xl text-cyan-500 rounded-md font-bold p-4"
		>
			<span>{player.name}</span>
		</div>
		<div class="flex flex-col gap-2 p-2 bg-slate-500 rounded-md font-semibold">
			<div class="stats-row">
				<span>Elo</span>
				<span>{player.elo}</span>
			</div>
			<div class="stats-row">
				<span>Wins</span>
				<span>{player.w}</span>
			</div>
			<div class="stats-row">
				<span>Losses</span>
				<span>{player.l}</span>
			</div>
		</div>
		<div class="bg-slate-500 rounded-md p-2 h-56">
			<Line options={chart.options} data={chart.data} />
		</div>
		<div class="flex flex-col gap-4">
			<div
				class="bg-slate-500 border-b-4 border-emerald-500 text-xl uppercase text-emerald-500 rounded-md font-bold p-4"
			>
				<span>Played with</span>
			</div>
			<div class="bg-slate-500 p-4 divide-y divide-slate-400 rounded-md">
				<div class="grid grid-cols-4 gap-4 font-bold text-slate-800 mb-2">
					<div class="col-span-2">Name</div>
					<button class="text-right hover:underline" on:click={sortByGamesPlayed}>Games</button>
					<button class="text-right hover:underline" on:click={sortByWinrate}>Winrate</button>
				</div>
				{#each sortedListOfPlayers as playedWithPlayer}
					<div class="grid mt-1 grid-cols-4 gap-4 text-slate-800 font-bold">
						<a
							data-sveltekit-reload
							href={`/player/${playedWithPlayer.id}`}
							class="col-span-2 hover:underline">{playedWithPlayer.name}</a
						>
						<div class="text-right">{playedWithPlayer.games}</div>
						<div
							class="text-right"
							class:win-text={playedWithPlayer.wins / playedWithPlayer.games >= 0.5}
							class:lose-text={playedWithPlayer.wins / playedWithPlayer.games < 0.5}
						>
							{`${(
								Math.round((playedWithPlayer.wins / playedWithPlayer.games) * 1000) / 10
							).toFixed(1)}%`}
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
	<div class="flex flex-col gap-4 w-[30rem]">
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
	</div>
</div>

<style lang="postcss">
	.stats-row {
		display: flex;
		justify-content: space-between;
		padding: 0.5rem 1rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}
	.stats-row:last-child {
		border-bottom: none;
	}
	.stats-row span {
		display: block;
	}
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
	.win-text {
		@apply text-lime-500;
	}
	.lose-text {
		@apply text-rose-500;
	}
</style>
