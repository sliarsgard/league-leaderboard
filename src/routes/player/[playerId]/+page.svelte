<script lang="ts">
	import type { PageData } from './$types';

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
		adc: 'ADC',
		sup: 'Support'
	};
</script>

<div class="flex gap-16">
	<div class="flex flex-col gap-4 w-60">
		<div class="bg-lime-500 rounded-md font-bold text-slate-800 uppercase p-4">
			<span>{player.name}</span>
		</div>
		<div class="flex flex-col gap-2 bg-slate-500 rounded-md">
			<div class="stats-row">
				<span>Elo:</span>
				<span>{player.elo}</span>
			</div>
			<div class="stats-row">
				<span>Wins:</span>
				<span>{player.w}</span>
			</div>
			<div class="stats-row">
				<span>Losses:</span>
				<span>{player.l}</span>
			</div>
		</div>
	</div>
	<div class="flex flex-col gap-4 w-80">
		<div class="bg-sky-500 rounded-md font-bold text-slate-800 uppercase p-4">
			<span>Game History</span>
		</div>
		{#each playerGameData as gameData}
			<div class="flex flex-col gap-2 bg-slate-500 rounded-md p-4">
				<div class="stats-row">
					<span>Game ID:</span>
					<span>{gameData.game_id}</span>
				</div>
				<div class="stats-row">
					<span>Champion:</span>
					<span>{getChampionName(gameData.champion)}</span>
				</div>
				<div class="stats-row">
					<span>Role:</span>
					<span>{roleNames[gameData.role] || gameData.role}</span>
				</div>
				<div class="stats-row">
					<span>Kills:</span>
					<span>{gameData.kills}</span>
				</div>
				<div class="stats-row">
					<span>Deaths:</span>
					<span>{gameData.deaths}</span>
				</div>
				<div class="stats-row">
					<span>Assists:</span>
					<span>{gameData.assists}</span>
				</div>
				<div class="stats-row">
					<span>Elo Change:</span>
					<span>{gameData.elo_change}</span>
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
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
