<script lang="ts">
	import { getContext } from "svelte";
	import Label from "../../lib/components/Label.svelte";

	const champions = getContext('champions') as any[]
    const champURL = (id: number) => `https://cdn.communitydragon.org/latest/champion/${id}/square`

	export let selected: string;
	let searchStr = '';
	let active: boolean;

	let searchLst = champions;
	$: handleChange(searchStr);
	$: searchLst = champions.filter((i: any) => i.name.toLowerCase().includes(searchStr.toLowerCase()));
	$: preselectedItem = searchLst.length && searchLst[0].name;

	const handleSelect = (item: string) => {
		active = false;
		preselectedItem = '';
		selected = item;
		searchStr = item;
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
				if (!preselectedItem) return (preselectedItem = searchLst[0].name);
				const itemIndex = searchLst.findIndex(i => i.name === preselectedItem);
				if (searchLst.length > itemIndex + 1) return (preselectedItem = searchLst[itemIndex + 1].name);
			} else if (e.key === 'ArrowUp') {
				if (!preselectedItem) return (preselectedItem = searchLst[0].name);
				const itemIndex = searchLst.findIndex(i => i.name === preselectedItem);
				if (itemIndex > 0) return (preselectedItem = searchLst[itemIndex - 1].name);
			} else if (e.key === 'Enter') {
				if (preselectedItem) handleSelect(preselectedItem);
			}
		}
	};
</script>

<div class="relative w-full" on:click|stopPropagation on:keypress>
	<Label forId="champ">Champion</Label>
	<input
		id="player"
		on:keydown={handleKeypress}
		on:focus={() => (active = true)}
		bind:value={searchStr}
		type="text"
		class="p-2 rounded-md bg-slate-200 outline-none w-full"
	/>
	{#if active}
		<div class="flex flex-col rounded-md overflow-hidden top-full absolute w-full z-10 shadow-xl">
			{#each searchLst as item}
				<button
					class="bg-slate-400 p-2 font-semibold overflow-hidden flex hover:bg-lime-400 active:bg-lime-500 items-center"
					class:preselect={preselectedItem === item.name}
					on:click={() => handleSelect(item.name)}
				>
                    <img src={champURL(item.id)} alt={item.name} class="w-6 h-6 mr-2" />
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
