<script lang="ts">
	import Kda from './KDA.svelte';
	import Select from '$lib/components/Select.svelte';
	import SelectChampion from './SelectChampion.svelte';
	import type { PlayerGameDataInput, PlayerWithIcon } from '$lib/types';
	import { getContext } from 'svelte';

	export let playersToSelect: PlayerWithIcon[];
	export let playerData: PlayerGameDataInput;
	export let blueTeam:boolean

	const filterPlayers: () => void = getContext('filterPlayers');
</script>

<div
	class="p-4 flex flex-col gap-2 rounded-md"
	class:blue={blueTeam}
	class:red={!blueTeam}
>
<div class="flex gap-2 items-end">
	<SelectChampion bind:selectedChampion={playerData.champion} />
	<Select onSelect={filterPlayers} bind:selectedId={playerData.id} data={playersToSelect} />
</div>
	<Kda bind:k={playerData.k} bind:d={playerData.d} bind:a={playerData.a} />
</div>

<style lang="postcss">
	.blue {
		@apply bg-sky-500 bg-opacity-30;
	}
	.red {
		@apply bg-rose-500 bg-opacity-30;
	}
</style>