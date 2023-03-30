<script lang="ts">
	import Kda from './KDA.svelte';
	import Select from '../../lib/components/Select.svelte';
	import SelectChampion from './SelectChampion.svelte';
	import type { PlayerGameDataInput } from '$lib/types';
	import { getContext } from 'svelte';

	export let playersToSelect: {
		name: string;
		elo: number;
		id: number;
	}[];
	export let playerData: PlayerGameDataInput;
	// export let class: string;

	const filterPlayers: () => void = getContext('filterPlayers');
</script>

<div
	class={`p-4 w-3/4 mx-auto rounded-xl border-2 text-center flex flex-col gap-2 ${$$props.class}`}
>
	<Select onSelect={filterPlayers} bind:selectedId={playerData.id} data={playersToSelect} />
	<Kda bind:k={playerData.k} bind:d={playerData.d} bind:a={playerData.a} />
	<SelectChampion bind:selected={playerData.champion} />
</div>

<style lang="postcss">
	/* Add styles for blue and red teams */
	.blue {
		@apply border-blue-400 bg-opacity-10 bg-blue-400;
	}
	.red {
		@apply border-red-400 bg-opacity-10 bg-red-400;
	}
</style>
