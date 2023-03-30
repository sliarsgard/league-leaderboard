<script lang="ts">
	import type { PageData } from './$types';
	import { Line } from 'svelte-chartjs';
	import { Chart, registerables } from 'chart.js';

	Chart.register(...registerables);

	export let data: PageData;
	const { champions, player, playerGameData } = data;

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
	const eloData = playerGameData
		.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
		.map((game) => game.elo_change);
	const eloOverTime = [
		1000,
		...eloData.reduce((acc: number[], cur) => {
			acc.push((acc[acc.length - 1] || 1000) + cur);
			return acc;
		}, [])
	];
	const gameNumbers = [0, ...playerGameData.map((_, index) => index + 1)];
</script>

<div class="flex gap-16">
	<div class="flex flex-col gap-4 w-[20rem]">
		<div class="bg-lime-500 rounded-md font-bold text-slate-800 uppercase p-4">
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
		<div class="bg-slate-500 rounded-md p-2">
			<Line
				options={{
					scales: {
						x: {
							type: 'linear',
							title: {
								display: true,
								color: '#000',
								text: 'Games'
							},
							ticks: {
								stepSize: 1,
								precision: 0,
								color: '#000'
							},
							grid: { color: '#3335' }
						},
						y: {
							grid: { color: '#3335' },
							ticks: { color: '#000' }
						}
					},
					plugins: {
						legend: { display: false }
					}
				}}
				data={{
					labels: gameNumbers,
					datasets: [
						{
							label: 'Elo Over Time',
							data: eloOverTime,
							borderColor: 'rgb(14 165 233)',
							backgroundColor: 'rgb(14 165 233)',
							borderWidth: 2,
							tension: 0
						}
					]
				}}
			/>
		</div>
	</div>
	<div class="flex flex-col gap-4 w-[30rem]">
		<div class="bg-sky-500 rounded-md font-bold text-slate-800 uppercase p-4">
			<span>Game History</span>
		</div>
		{#each playerGameData.reverse() as gameData}
			<a
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
</style>
