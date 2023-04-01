<script lang="ts">
	import type { Player } from '$lib/types';
	import type { PageData } from './$types';
	import { getTier, getTierUrl } from '$lib/util';

	export let data: PageData;

	let { players, supabase } = data;

	supabase
		.channel('any')
		.on<Player>('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'players' }, (payload) => {
			players = players
				.map((player) => (player.id === payload.new.id ? payload.new : player))
				.sort((a, b) => b.elo - a.elo);
		})
		.subscribe();
</script>

<div class="flex flex-col items-center pb-16">
	<p class="text-emerald-400 px-4 py-4 border-b-4 border-emerald-500 rounded-md text-5xl font-bold uppercase">Avetint's Leaderboard</p>

	<div class="flex flex-col items-center gap-6 mt-8 w-[60rem]">
		{#each players as player, i}
			<a
				data-sveltekit-preload-data
				href={`/player/${player.id}`}
				class="w-2/3 flex gap-4 align-middle items-center"
			>
				<span class="text-4xl text-center font-bold text-slate-200 w-11"class:first={i === 0}
				class:second={i === 1}
				class:third={i === 2}>{i + 1}</span>
				<div
					class="p-4 w-full rounded-xl border-4 border-emerald-400 bg-opacity-10 bg-emerald-400 text-center flex hover:bg-opacity-20 active:bg-opacity-30"
					class:first={i === 0}
					class:second={i === 1}
					class:third={i === 2}
				>
					<span class="text-xl font-bold text-slate-100 w-1/2 text-left flex gap-2">
						<img src={getTierUrl(player.elo)} alt={getTier(player.elo)} class="w-8 h-8" />
						<span class="">{`${player.name}`}</span>
					</span>
					<p class="text-xl font-bold text-slate-100 w-1/4">{`${player.elo} elo`}</p>
					<p class="text-xl font-bold text-slate-100 w-1/4">{`${player.w} W - ${player.l} L`}</p>
				</div>
			</a>
		{/each}
	</div>
</div>

<style lang="postcss">
	div.first {
		@apply border-yellow-400 shadow-lg shadow-yellow-300 bg-opacity-10 bg-yellow-300 hover:bg-opacity-20 active:bg-opacity-30;
	}
	div.second {
		@apply border-neutral-400 shadow-lg shadow-neutral-300 bg-opacity-10 bg-neutral-300 hover:bg-opacity-20 active:bg-opacity-30;
	}
	div.third {
		@apply border-orange-400 shadow-lg shadow-orange-300 bg-opacity-10 bg-orange-300 hover:bg-opacity-20 active:bg-opacity-30;
	}
	span.first {
		@apply text-yellow-400;
	}
	span.second {
		@apply text-neutral-400;
	}
	span.third {
		@apply text-orange-400;
	}
</style>
