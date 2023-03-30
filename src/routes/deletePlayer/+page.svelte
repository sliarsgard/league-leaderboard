<script lang="ts">
	import supabase from "$lib/supabase";
	import type { PageData } from "./$types";

	export let data: PageData;

    let players = data.players;

    const deletePlayer = async (player: PageData['players'][number]) => {
        await supabase.from('players').delete().eq('id', player.id);
    }
    supabase
		.channel('any')
		.on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'players' }, (payload) => {
			console.log('Change received!', payload);
			players = players.filter((player) => player.id !== payload.old.id);
		}).subscribe();
</script>

<div class="flex flex-col gap-2">
    {#each players as player}
    <div class="flex justify-between gap-8 py-2 px-4 bg-slate-500 rounded-md">
        <span>{player.name}</span>
        <button class="text-red-300 font-bold" on:click={() => deletePlayer(player)}>x</button>
    </div>
    {/each}
</div>