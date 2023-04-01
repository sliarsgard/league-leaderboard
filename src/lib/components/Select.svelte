<script lang="ts">
	import Label from './Label.svelte';

	interface Player {
		name: string;
		elo: number;
		id: number;
	}
	
	export let data: Player[];

	export let onSelect: () => void;
	export let selectedId: number;
	let selected: Player | null = null;
	let searchStr = '';
	let active: boolean;
	let addNew: Player[] = []

	$: if (selected) selectedId = selected.id

	let searchLst = data;
	$: searchLst = data.filter((i) => i.name.toLowerCase().includes(searchStr.toLowerCase()) && i.id > 0);
	$: handleChange(searchStr);
	$: preselectedItem = searchLst.length && searchLst[0];

	const handleSelect = async (item: Player) => {
		if (item.id === -1) {
			await fetch(`/api/addplayer?name=${searchStr}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
			});
			searchStr = '';
		} else {
			selected = item;
			searchStr = item.name;
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
			addNew = [{id: -1,name: `Add new player "${searchStr}"`,elo: 0}]
		else if (searchLst.length > 0)
			addNew = []
	};

	const handleKeypress = (e: KeyboardEvent) => {
		if (searchLst.length) {
			if (e.key === 'ArrowDown') {
				if (!preselectedItem) return (preselectedItem = searchLst[0]);
				const itemIndex = searchLst.indexOf(preselectedItem);
				if (searchLst.length > itemIndex + 1) return (preselectedItem = searchLst[itemIndex + 1]);
			} else if (e.key === 'ArrowUp') {
				if (!preselectedItem) return (preselectedItem = searchLst[0]);
				const itemIndex = searchLst.indexOf(preselectedItem);
				if (itemIndex > 0) return (preselectedItem = searchLst[itemIndex - 1]);
			} else if (e.key === 'Enter') {
				if (preselectedItem) handleSelect(preselectedItem);
			}
		}
	};
</script>

<div class="relative w-full" on:click|stopPropagation on:keypress>
	<Label forId="player">Player name</Label>
	<input
		id="player"
		on:keydown={handleKeypress}
		on:focus={() => (active = true)}
		bind:value={searchStr}
		type="text"
		class="p-2 rounded-md bg-slate-200 text-slate-800 outline-none w-full"
	/>
	{#if active}
		<div class="flex flex-col rounded-md overflow-hidden top-full absolute w-full z-10 shadow-xl">
			{#each [...searchLst, ...addNew] as item}
				<button
					class="bg-slate-500 p-2 font-semibold overflow-hidden hover:bg-lime-400 active:bg-lime-500 text-slate-100"
					class:preselect={preselectedItem === item.id}
					on:click={() => handleSelect(item)}
				>
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
