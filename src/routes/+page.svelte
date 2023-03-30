<script lang="ts">
	import supabase from '$lib/supabase';
	import type { PageData } from './$types';

	export let data: PageData;

	let { players } = data;

	const getTier = (elo: number) => {
		if (elo >= 2400) {
			return 'Challenger';
		} else if (elo >= 1800) {
			return 'Grandmaster';
		} else if (elo >= 1500) {
			return 'Master';
		} else if (elo >= 1300) {
			return 'Diamond';
		} else if (elo >= 1100) {
			return 'Platinum';
		} else if (elo >= 900) {
			return 'Gold';
		} else if (elo >= 700) {
			return 'Silver';
		} else if (elo >= 500) {
			return 'Bronze';
		} else {
			return 'Iron';
		}
	}

	supabase
		.channel('any')
		.on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'players' }, (payload) => {
			// @ts-expect-error - this is a hack to get around the fact that the payload is not typed
			players = players
				.map((player) => player.id === payload.new.id ? payload.new : player)
				.sort((a, b) => b.elo - a.elo);
		}).subscribe();

	const getTierUrl = (elo: number) => 
		`https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-mini-crests/${getTier(elo).toLowerCase()}.png`
</script>

<div class="flex flex-col pb-16">
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
					<span class="text-xl font-bold text-slate-100 w-1/2 text-left flex gap-2">
						<img
							src={getTierUrl(player.elo)}
							alt={getTier(player.elo)}
							class="w-8 h-8"
						/>
						<span class="">{`${player.name}`}</span>
					</span>
					<p class="text-xl font-bold text-slate-100 w-1/4">{`${player.elo} elo`}</p>
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
