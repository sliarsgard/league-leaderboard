<script lang="ts">
	import type { PageData } from './$types';
	import { Line } from 'svelte-chartjs';
	import { Chart, registerables } from 'chart.js';
	import { setContext } from 'svelte';
	import GameHistory from './GameHistory.svelte';
	import PlayedWith from './PlayedWith.svelte';
	import Champions from './Champions.svelte';
	import Roles from './Roles.svelte';
	import { getTier, getTierUrl } from '$lib/util';

	Chart.register(...registerables);

	export let data: PageData;
	const { champions, player, playerGameData, chart, playedWithPlayers } = data;
	setContext('champions', champions);

	
	
</script>

<div class="flex gap-16 mb-8">
	<div class="flex flex-col gap-4 w-[20rem]">
		<div
			class="bg-slate-500 flex justify-between border-b-4 border-cyan-500 text-2xl text-cyan-500 rounded-md font-bold p-4"
		>
		<span>{player.name}</span>
		<img src={getTierUrl(player.elo)} alt={getTier(player.elo)} class="w-8 h-8" />
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
			<PlayedWith {playedWithPlayers} />
		</div>
	</div>
	<div class="flex flex-col gap-4 w-[25rem]">
		<GameHistory {playerGameData} />
	</div>
	<div class="flex flex-col gap-4 w-[20rem]">
		<Roles {playerGameData} />
		<Champions {playerGameData} />
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
</style>
