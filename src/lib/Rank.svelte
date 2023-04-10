<script lang="ts">
	import { getTier, getTierUrl } from './util';

	export let elo: number;
    export let size: number = 16;

</script>

<div class="relative overflow-hidden" style="width: {size}rem; height: {size*0.7}rem">
	<div style="width: {size}rem; height: {size*0.7}rem"/>
	<div class="absolute left-1/2 top-1/2 w-[500%]">
		<div class="absolute w-full -translate-x-1/2 -translate-y-1/2 top-0 left-0">
			<img src={getTierUrl(elo, true)} alt={getTier(elo)} />
		</div>
	</div>
</div>
