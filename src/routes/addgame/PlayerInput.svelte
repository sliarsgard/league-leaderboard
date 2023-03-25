<script lang="ts">
	import Kda from "./KDA.svelte";
	import Select from "../../lib/Select.svelte";
	import SelectChampion from "./SelectChampion.svelte";
	import type { PlayerGameData } from "../../lib/types";
	import { getContext } from "svelte";
    
    export let playersToSelect: string[]
    export let playerData: PlayerGameData

    const filterPlayers: () => void = getContext('filterPlayers')
</script>

<div class="p-2 bg-slate-500 rounded-md">
    <Select onSelect={filterPlayers} bind:selected={playerData.name} data={playersToSelect} />
    <Kda k={playerData.k} d={playerData.d} a={playerData.a} />
    <SelectChampion selected={playerData.champion} />
</div>