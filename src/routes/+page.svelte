<script lang="ts">
	import type { PageData } from './$types';
	import { getIconUrl, getTier, getTierPoints, getTierUrl } from '$lib/util';
	import type { Player } from '$lib/types/database';
	import * as htmlToImage from 'html-to-image';
	import download from 'downloadjs';
	import { tick } from 'svelte';

	export let data: PageData;
	let showTopTierlist = false;
	let { players, supabase, session } = data;
	supabase
		.channel('any')
		.on<Player>(
			'postgres_changes',
			{ event: 'UPDATE', schema: 'public', table: 'players' },
			(payload) => {
				players = players
					.map((player) => ({
						...player,
						...(player.id === payload.new.id ? payload.new : player)
					}))
					.sort((a, b) => b.elo - a.elo);
			}
		)
		.subscribe();

	const createImage = async () => {
		showTopTierlist = true;
		await tick();
		const node = document.getElementById('topTierlist');
		if (!node) return;
		const imageUrl = await htmlToImage.toPng(node);
		const imageUrl2 = await htmlToImage.toBlob(node);
		if (!imageUrl2) return;
		showTopTierlist = false;
		const { data, error } = await supabase.storage.from('image').upload('leaderboard.png',imageUrl2);
		console.log(data, error);
		download(imageUrl, 'leaderboard.png', 'image/png');
	};
</script>

{#if session}
	<button
		on:click={createImage}
		class="uppercase text-slate-500 font-mono font-bold p-1 text-xs fixed bottom-0 left-0"
	>
		Screenshot
	</button>
{/if}

<div class="flex flex-col items-center pb-16">
	<p
		class="text-slate-200 text-center px-4 py-4 border-b-4 border-slate-500 rounded-md text-4xl font-bold uppercase"
	>
		Avetint's Leaderboard
	</p>

	<div class="flex flex-col items-center gap-6 w-full mt-8 sm:w-[36rem]" id="leaderboard">
		{#each players as player, i}
			<div class="w-full">
				<a
					data-sveltekit-preload-data
					href={`/player/${player.id}`}
					class="w-full flex gap-1 sm:gap-4 align-middle items-center"
				>
					<span class="text-4xl text-center font-bold text-slate-200 w-10">{i + 1}</span>
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
						<div class="p-1 sm:p-3 grid grid-cols-3 sm:grid-cols-4 items-center w-full">
							<span
								class="col-span-2 text-lg sm:text-2xl font-bold text-slate-100 text-left flex gap-2"
							>
								<span>{player.name}</span>
							</span>
							<span
								class="row-span-2 sm:row-span-1 text-2xl font-bold items-center text-slate-100 flex gap-2"
							>
								<img
									src={getTierUrl(player.elo)}
									alt={getTier(player.elo)}
									class="w-10 h-10 rounded-full"
								/>
								<span>{getTierPoints(player.elo)}p</span>
							</span>
							<span class="text-left text-lg sm:text-2xl font-bold text-slate-100">
								{`${player.wins} W - ${player.losses} L`}
							</span>
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
						<div
							class={`h-2 w-full line rounded-md ${getTier(player.elo).toLowerCase()} opacity-50`}
						/>
					</div>
				{/if}
			</div>
		{/each}
	</div>
	<!-- {#if !showTopTierlist} -->
	<div
		id="topTierlist"
		class="bg-slate-600 flex flex-col items-center gap-6 w-full mt-8 sm:w-[37rem] p-2"
	>
		{#each players.filter((_, i) => i < 3) as player, i}
			<div class="w-full">
				<a
					data-sveltekit-preload-data
					href={`/player/${player.id}`}
					class="w-full flex gap-1 sm:gap-4 align-middle items-center"
				>
					<span class="text-4xl text-center font-bold text-slate-200 w-10">{i + 1}</span>
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
						<div class="p-1 sm:p-3 grid grid-cols-3 sm:grid-cols-4 items-center w-full">
							<span
								class="col-span-2 text-lg sm:text-2xl font-bold text-slate-100 text-left flex gap-2"
							>
								<span>{player.name}</span>
							</span>
							<span
								class="row-span-2 sm:row-span-1 text-2xl font-bold items-center text-slate-100 flex gap-2"
							>
								<img
									src={getTierUrl(player.elo)}
									alt={getTier(player.elo)}
									class="w-10 h-10 rounded-full"
								/>
								<span>{getTierPoints(player.elo)}p</span>
							</span>
							<span class="text-left text-lg sm:text-2xl font-bold text-slate-100">
								{`${player.wins} W - ${player.losses} L`}
							</span>
						</div>
					</div>
				</a>
			</div>
		{/each}
		<div />
	</div>
	<!-- {/if} -->
</div>

<svelte:head>
	<title>Avetint Leaderboard</title>
	<meta name="description" content="" />
</svelte:head>

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
	div.challenger.line {
		@apply bg-amber-300;
	}
	div.grandmaster.line {
		@apply bg-red-300;
	}
	div.master.line {
		@apply bg-fuchsia-300;
	}
	div.diamond.line {
		@apply bg-cyan-400;
	}
	div.platinum.line {
		@apply bg-emerald-300;
	}
	div.gold.line {
		@apply bg-yellow-400;
	}
	div.silver.line {
		@apply bg-neutral-200;
	}
	div.bronze.line {
		@apply bg-amber-600;
	}
	div.iron.line {
		@apply bg-stone-400;
	}
</style>
