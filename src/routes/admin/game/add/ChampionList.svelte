<script lang="ts">
	import { getChampionImageUrl } from '$lib/util';
	import { getContext } from 'svelte';

	export let selectedChampion: number;
	export let open: boolean;

	let search = '';
	let searchInput: HTMLInputElement;

	const champions = (getContext('champions') as any[])
		.sort((a, b) => {
			if (a.name < b.name) return -1;
			if (a.name > b.name) return 1;
			return 0;
		})
		.sort((a, b) => {
			if (a.id === -1) return -1;
			if (b.id === -1) return 1;
			return 0;
		});

	$: filteredChampions = champions.filter((i: any) =>
		i.name.toLowerCase().includes(search.toLowerCase())
	);
	$: if (open && searchInput) searchInput.focus();

	const handleSelect = (championId: number) => {
		selectedChampion = championId;
		search = '';
		open = false;
	};
</script>

{#if open}
	<div
		class="absolute w-[30rem] p-2 z-20 bg-slate-700 -translate-x-1/2 left-1/2 rounded-md shadow-md"
	>
		<input
			type="text"
			bind:this={searchInput}
			bind:value={search}
			class="w-full p-1 mb-2 outline-none"
		/>
		<div class="grid gap-2 grid-cols-8">
			{#each filteredChampions as champion}
				<button on:click={() => handleSelect(champion.id)}>
					<div class="bg-slate-500">
						<img
							src={getChampionImageUrl(champion.id)}
							alt={champion.name}
							class="w-full h-full hover:opacity-70"
						/>
					</div>
				</button>
			{/each}
		</div>
	</div>
{/if}
<svelte:window on:click={() => (open = false)} />
