<script lang="ts">
	import Select from '$lib/Select.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let winningTeam = 0;

	const { players } = data;

	let selectedPlayers = ['', '', '', '', '', '', '', '', '', ''];

    const handleAddGame = async () => {
        const team1 = selectedPlayers.filter((_, i) => i < 5)
        const team2 = selectedPlayers.filter((_, i) => i >= 5)
        fetch('/api/addgame', {
            method: 'POST',
            body: JSON.stringify({
                winningTeamNames: winningTeam === 1 ? team1 : team2,
                losingTeamNames: winningTeam === 1 ? team2 : team1,
            })
        })
    }

	$: playersToSelect = players
		.filter((player) => !selectedPlayers.includes(player.name))
		.map((p) => p.name);
</script>

<div class="flex flex-col gap-24">
	<div class="flex gap-24">
		<div class="flex flex-col gap-8">
			<p class="text-center text-xl text-slate-100 font-bold">Team 1</p>
			<Select bind:selected={selectedPlayers[0]} data={playersToSelect} />
			<Select bind:selected={selectedPlayers[1]} data={playersToSelect} />
			<Select bind:selected={selectedPlayers[2]} data={playersToSelect} />
			<Select bind:selected={selectedPlayers[3]} data={playersToSelect} />
			<Select bind:selected={selectedPlayers[4]} data={playersToSelect} />
		</div>
		<div class="flex flex-col gap-8">
			<p class="text-center text-xl text-slate-100 font-bold">Team 2</p>
			<Select bind:selected={selectedPlayers[5]} data={playersToSelect} />
			<Select bind:selected={selectedPlayers[6]} data={playersToSelect} />
			<Select bind:selected={selectedPlayers[7]} data={playersToSelect} />
			<Select bind:selected={selectedPlayers[8]} data={playersToSelect} />
			<Select bind:selected={selectedPlayers[9]} data={playersToSelect} />
		</div>
	</div>
	<div class="w-full flex">
        <div class="w-1/3 flex justify-end">
            <button class="p-2 bg-slate-400 rounded-lg w-full text-lg font-bold" class:win={winningTeam === 1} on:click={() => winningTeam = 1}>Team 1</button>
        </div>
        <div class="w-1/3 text-center p-2 uppercase text-lime-500 font-bold text-xl">
            Winning Team
        </div>
        <div class="w-1/3 flex justify-start">
            <button class="p-2 bg-slate-400 rounded-lg w-full text-lg font-bold" class:win={winningTeam === 2} on:click={() => winningTeam = 2}>Team 2</button>
        </div>
    </div>
    <div class="flex justify-center">
        <button class="bg-slate-400 p-4 w-full rounded-md font-bold text-xl uppercase" on:click={handleAddGame}>Add game</button>
    </div>
</div>

<style lang="postcss">
    .win {
        @apply bg-lime-500;
    }
</style>