<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	const { players } = data;
    const orderedPlayers = players.sort((a,b) => b.points - a.points)
</script>

<div class="flex flex-col">
	<p class="text-lime-500 text-4xl font-bold uppercase">Avetint's League of Legends Leaderboard</p>

	<div class="flex flex-col items-center gap-6 mt-8">
		{#each players as player, i}
			<div class="w-2/3 flex gap-4 align-middle items-center">
				<span class="text-4xl text-center font-bold text-slate-200 w-11">{i + 1}</span>
				<div
					class="p-4 w-full rounded-xl border-4 border-lime-400 bg-opacity-10 bg-lime-400 text-center flex"
					class:first={i === 0}
					class:second={i === 1}
					class:third={i === 2}
				>
					<p class="text-xl font-bold text-slate-100 w-1/2 text-left">{`${player.name}`}</p>
					<p class="text-xl font-bold text-slate-100 w-1/4">{`${player.points}p`}</p>
					<p class="text-xl font-bold text-slate-100 w-1/4">{`${player.w} W - ${player.l} L`}</p>
				</div>
			</div>
		{/each}
	</div>
</div>

<style lang="postcss">
	.first {
		@apply border-yellow-400 shadow-lg shadow-yellow-300 bg-opacity-10 bg-yellow-300;
	}
	.second {
		@apply border-neutral-400 shadow-lg shadow-neutral-300 bg-opacity-10 bg-neutral-300;
	}
	.third {
		@apply border-orange-400 shadow-lg shadow-orange-300 bg-opacity-10 bg-orange-300;
	}
</style>
