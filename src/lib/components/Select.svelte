<script lang="ts">
	import Label from './Label.svelte';

	export let data: string[];

	export let onSelect: () => void;
	export let selected: string;
	let searchStr = '';
	let active: boolean;

	let searchLst = data;
	$: handleChange(searchStr);
	$: searchLst = data.filter((i) => i.toLowerCase().includes(searchStr.toLowerCase()));
	$: preselectedItem = searchLst.length && searchLst[0];

	const handleSelect = (item: string) => {
		active = false;
		preselectedItem = '';
		selected = item;
		searchStr = item;
		onSelect();
	};

	const handleChange = (_: any) => {
		if (selected && selected !== searchStr) {
			selected = '';
			active = true;
		}
	};

	const handleKeypress = (e: KeyboardEvent) => {
		console.log(e.key);

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
			{#each searchLst as item}
				<button
					class="bg-slate-500 p-2 font-semibold overflow-hidden hover:bg-lime-400 active:bg-lime-500 text-slate-100"
					class:preselect={preselectedItem === item}
					on:click={() => handleSelect(item)}
				>
					{item}
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
