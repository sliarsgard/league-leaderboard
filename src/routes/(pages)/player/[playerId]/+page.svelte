<script lang="ts">
	import type { PageData } from './$types';
	import { Line } from 'svelte-chartjs';
	import { Chart, registerables } from 'chart.js';
	import { setContext } from 'svelte';
	import GameHistory from './GameHistory.svelte';
	import PlayedWith from './PlayedWith.svelte';
	import Champions from './Champions.svelte';
	import Roles from './Roles.svelte';
	import { getIconUrl, getTier, getTierPoints, getTierUrl } from '$lib/util';
	import Rank from '$lib/Rank.svelte';

	Chart.register(...registerables);

	export let data: PageData;
	const { champions, player, playerGameData, chart, playedWithPlayers } = data;
	setContext('champions', champions);
</script>

<div class="grid lg:grid-cols-3 sm:grid-cols-2 gap-x-16 gap-y-4 mb-8">
	<div class="flex flex-col gap-4">
		<div
			class="bg-slate-500 overflow-hidden flex border-b-4 border-cyan-500 text-2xl text-cyan-500 rounded-md font-bold"
		>
		<img class="w-16 h-16" src={getIconUrl(player.profileIconId)} alt={player.profileIconId.toString()}>
		<div
		class="flex justify-between p-4 w-full">
			<span>{player.name}</span>
			<img src={getTierUrl(player.elo)} alt={getTier(player.elo)} class="w-8 h-8" />
		</div>
	</div>
	<div class="flex flex-col gap-2 p-2 bg-slate-500 rounded-md font-semibold text-lg">
		<div class="flex gap-2">
			<img src={getTierUrl(player.elo, true)} alt={getTier(player.elo)} class="w-20 h-20" />
			<div class="flex flex-col">
					<span class="font-bold text-slate-200 text-xl">{`${getTier(player.elo)} ${getTierPoints(player.elo)}p`}</span>
					<span class="text-sm text-slate-300">Wins: <span class="font-bold text-lime-400">{player.wins}</span> - Losses: <span class="text-red-400 font-bold">{player.losses}</span></span>
					<span class="text-sm text-slate-300">{`${(player.wins / (player.wins + player.losses)*100).toFixed(1)}% wr`}</span>
				</div>
			</div>
		</div>
		<div class="bg-slate-500 rounded-md p-2 h-56">
			<Line options={chart.options} data={chart.data} />
		</div>
		<div class="flex flex-col gap-4">
			<PlayedWith {playedWithPlayers} />
		</div>
	</div>
	<div class="flex flex-col gap-4">
		<GameHistory {playerGameData} />
	</div>
	<div class="flex flex-col gap-4">
		<Roles {playerGameData} />
		<Champions {playerGameData} />
	</div>
</div>
