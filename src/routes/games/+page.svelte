<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	const { games } = data;
</script>

<div>
    {#each games as game}
        <div>
            {#each game.winningTeam as player}
                <div>{player.name}</div>
            {/each}
        </div>
    {/each}
</div>