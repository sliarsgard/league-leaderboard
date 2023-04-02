<script lang="ts">
	import type { PlayerWithIcon } from '$lib/types';
	import type { PageData } from './$types';
	import { getIconUrl, getTier, getTierPoints, getTierUrl } from '$lib/util';

	export let data: PageData;

	let { players, supabase } = data;
	supabase
		.channel('any')
		.on<PlayerWithIcon>(
			'postgres_changes',
			{ event: 'UPDATE', schema: 'public', table: 'players' },
			(payload) => {
				players = players
					.map((player) => (player.id === payload.new.id ? payload.new : player))
					.sort((a, b) => b.elo - a.elo);
			}
		)
		.subscribe();
</script>

<div class="flex flex-col items-center pb-16">
	<p
		class="text-slate-200 px-4 py-4 border-b-4 border-slate-500 rounded-md text-5xl font-bold uppercase"
	>
		Avetint's Leaderboard
	</p>

	<div class="flex flex-col items-center gap-6 mt-8 w-[36rem]">
		{#each players as player, i}
			<div class="w-full">
				<a
					data-sveltekit-preload-data
					href={`/player/${player.id}`}
					class="w-full flex gap-4 align-middle items-center"
				>
					<span class="text-4xl text-center font-bold text-slate-200 w-11">{i + 1}</span>
					<div
						class={`w-full rounded-xl border-4 flex bg-opacity-10 text-center hover:bg-opacity-20 active:bg-opacity-30 ${getTier(
							player.elo
						).toLowerCase()}`}
					>
						<img
							src={getIconUrl(player.profileIconId)}
							alt={player.profileIconId}
							class="w-16 h-16 rounded-l-md"
						/>
						<div class="p-3 flex w-full items-center">
							<span class="text-2xl font-bold text-slate-100 w-1/2 text-left flex gap-2">
								<span>{player.name}</span>
							</span>
							<span class="text-2xl font-bold items-center text-slate-100 flex gap-2 w-1/4">
								<img
									src={getTierUrl(player.elo)}
									alt={getTier(player.elo)}
									class="w-10 h-10 rounded-full"
								/>
								<span>{getTierPoints(player.elo)}p</span>
							</span>
							<p class="text-2xl font-bold text-slate-100 w-1/4">
								{`${player.w} W - ${player.l} L`}
							</p>
						</div>
					</div>
				</a>
				{#if i < players.length - 1 && getTier(player.elo) !== getTier(players[i + 1].elo)}
					<div class="flex w-full items-center -mb-6">
						<img
							src={getTierUrl(player.elo)}
							alt={getTier(player.elo)}
							class="w-10 h-10 rounded-full"
						/>
						<div class="h-2 w-full bg-slate-300" />
					</div>
				{/if}
			</div>
		{/each}
	</div>
</div>

<style lang="postcss">
	div.challenger {
		@apply border-amber-400 shadow-xl shadow-amber-300 bg-opacity-10 bg-amber-300 hover:bg-opacity-20 active:bg-opacity-30;
	}
	div.grandmaster {
		@apply border-red-400 shadow-lg shadow-red-300 bg-opacity-10 bg-red-300 hover:bg-opacity-20 active:bg-opacity-30;
	}
	div.master {
		@apply border-fuchsia-400 shadow-md shadow-fuchsia-300 bg-opacity-10 bg-fuchsia-300 hover:bg-opacity-20 active:bg-opacity-30;
	}
	div.diamond {
		@apply border-cyan-500 bg-opacity-10 bg-cyan-400 hover:bg-opacity-20 active:bg-opacity-30;
	}
	div.platinum {
		@apply border-emerald-400 shadow-emerald-300 bg-opacity-10 bg-emerald-300 hover:bg-opacity-20 active:bg-opacity-30;
	}
	div.gold {
		@apply border-amber-500 bg-opacity-10 bg-yellow-400 hover:bg-opacity-20 active:bg-opacity-30;
	}
	div.silver {
		@apply border-neutral-300 bg-opacity-10 bg-neutral-200 hover:bg-opacity-20 active:bg-opacity-30;
	}
	div.bronze {
		@apply border-amber-700 bg-opacity-10 bg-amber-600 hover:bg-opacity-20 active:bg-opacity-30;
	}
	div.iron {
		@apply border-stone-500 bg-opacity-10 bg-stone-400 hover:bg-opacity-20 active:bg-opacity-30;
	}
</style>
