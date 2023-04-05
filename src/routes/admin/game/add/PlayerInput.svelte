<script lang="ts">
	import Kda from './KDA.svelte';
	import Select from '$lib/components/Select.svelte';
	import SelectChampion from './SelectChampion.svelte';
	import { getContext } from 'svelte';
	import type { PlayerWithIcon } from '$lib/types/extended';
	import type { PlayerGameDataInsert } from '$lib/types/database';

	export let playersToSelect: PlayerWithIcon[];
	export let playerData: PlayerGameDataInsert;
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
	<Select onSelect={filterPlayers} bind:selectedId={playerData.player_id} data={playersToSelect} />
</div>
	<Kda bind:kills={playerData.kills} bind:deaths={playerData.deaths} bind:assists={playerData.assists} />
</div>

<style lang="postcss">
	.blue {
		@apply bg-sky-500 bg-opacity-30;
	}
	.red {
		@apply bg-rose-500 bg-opacity-30;
	}
</style>