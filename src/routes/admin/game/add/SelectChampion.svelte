<script lang="ts">
	import { getChampionImageUrl } from '$lib/util';
	import ChampionList from './ChampionList.svelte';

	export let selectedChampion: number
	let open = false;

</script>

<div class="relative h-[52px]" on:click|stopPropagation on:keydown>
	<button class="border-2 border-slate-500 relative hover:opacity-80 rounded-md overflow-hidden w-[52px] h-[52px]" on:click={() => (open = true)}>
		<img src={getChampionImageUrl(selectedChampion)} alt="Champion" class="w-12 h-12" />
		<i class="material-symbols-outlined absolute top-8 left-9 text-sm text-white">expand_more</i>
	</button>
	<ChampionList bind:selectedChampion bind:open />
</div>
