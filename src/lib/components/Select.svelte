<script lang="ts">
	import type { PlayerWithIcon } from '$lib/types/extended';
	import { getIconUrl } from '$lib/util';

	export let data: PlayerWithIcon[];
	export let onSelect: () => void;
	export let selectedId: number;
	let selected: PlayerWithIcon | null = null;
	let searchStr = '';
	let active: boolean;
	let addNew: PlayerWithIcon[] = []
	let key = Math.random();

	$: if (selected) selectedId = selected.id

	let searchLst = data;
	$: searchLst = data.filter((i) => i.name.toLowerCase().includes(searchStr.toLowerCase()) && i.id > 0);
	$: handleChange(searchStr);
	$: preselectedItem = searchLst.length && searchLst[0].id;
	const handleSelect = async (item: number) => {
		if (item === -1) {
			await fetch(`/api/addplayer?name=${searchStr}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
			});
			searchStr = '';
		} else {
			const index = searchLst.findIndex((i) => i.id === item);
			selected = searchLst[index];
			searchStr = selected.name;
			active = false;
			preselectedItem = 0;
			onSelect();
		}
	};

	const handleChange = (_: any) => {
		if (selected?.id && selected.name !== searchStr) {
			selected = null;
			active = true;
		}
		if (searchLst.length === 0)
			addNew = [{id: -1,name: `Add new player "${searchStr}"`,elo: 0, profileIconId: 0, wins: 0, losses: 0, created_at: new Date().toDateString()}]
		else if (searchLst.length > 0)
			addNew = []
	};

	const handleKeypress = (e: KeyboardEvent) => {
		if (searchLst.length) {
			if (e.key === 'ArrowDown') {
				if (!preselectedItem) return (preselectedItem = searchLst[0].id);
				const index = searchLst.findIndex((i) => i.id === preselectedItem);
				if (searchLst.length > index + 1) return (preselectedItem = searchLst[index + 1].id);
			} else if (e.key === 'ArrowUp') {
				if (!preselectedItem) return (preselectedItem = searchLst[0].id);
				const index = searchLst.findIndex((i) => i.id === preselectedItem);
				if (index > 0) return (preselectedItem = searchLst[index - 1].id);
			} else if (e.key === 'Enter') {
				if (preselectedItem) handleSelect(preselectedItem);
			}
		}
	};
</script>

<div class="relative w-full flex flex-col items-start" on:click|stopPropagation on:keypress>
	<label class="uppercase text-slate-200 font-mono text-sm font-bold" for={`player-${key}`}>Player</label>
	<input
		id={`player-${key}`}
		on:keydown={handleKeypress}
		on:focus={() => (active = true)}
		bind:value={searchStr}
		type="text"
		class="p-2 rounded-md bg-slate-400 text-slate-800 outline-none w-full"
	/>
	{#if active}
		<div class="flex flex-col rounded-md overflow-hidden top-full absolute w-full z-10 shadow-xl">
			{#each [...searchLst, ...addNew] as item}
				<button
					class="bg-slate-500 p-2 font-semibold overflow-hidden text-slate-100 flex gap-2 items-center"
					class:preselect={preselectedItem === item.id}
					on:click={() => handleSelect(item.id)}
				>
				<img src={getIconUrl(item.profileIconId)} alt={item.profileIconId.toString()} class="w-8 h-8 rounded-md" />
				{item.name}
				</button>
			{/each}
		</div>
	{/if}
</div>

<svelte:window on:click|stopPropagation={() => (active = false)} />

<style lang="postcss">
	.preselect {
		@apply bg-slate-300;
	}
</style>
