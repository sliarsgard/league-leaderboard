<script lang="ts">
	import supabase from '$lib/supabase';
	import type { Player } from '$lib/types';
	import type { PageData } from './$types';
	export let data: PageData;
	let { players } = data;
	supabase
		.channel('any')
		.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'players' }, (payload) => {
			players = [...players, payload.new.name];
		})
		.subscribe();

	let playerList: Player[] = [];

	let team1: Player[] = [];
	let team2: Player[] = [];

	const matchPlayers = async () => {
		const res = await fetch('/api/match', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ playerIds: playerList.map((p) => p.id) })
		});
		[team1, team2] = await res.json();
	};
</script>

<div class="flex gap-16">
	<div class="flex flex-col gap-2 w-60">
		<div class="flex justify-between py-2 px-4 bg-lime-500 rounded-md font-bold">
			<span>Player list</span>
		</div>
		{#each players.filter((p) => !playerList.some((player) => player.id === p.id)) as player}
			<div class="flex gap-2">
				<button
					class="p-2 pb-1 flex bg-lime-500 rounded-md font-bold text-slate-800 uppercase"
					on:click={() => (playerList = [...playerList, player])}
					><i class="material-symbols-outlined">add</i></button
				>
				<div
					class="flex justify-between gap-8 py-2 px-4 bg-slate-500 rounded-md font-semibold w-full"
				>
					<span>{player.name}</span>
				</div>
			</div>
		{/each}
	</div>
	<div class="flex flex-col gap-4 w-60">
		<div class="flex flex-col gap-2">
			<div class="flex justify-between gap-8 py-2 px-4 bg-lime-500 rounded-md font-bold">
				<span>Added players</span>
				<span>{`${playerList.length}/10`}</span>
			</div>
			{#each playerList as player}
				<div class="flex gap-2">
					<button
						class="p-2 pb-1 flex bg-red-500 rounded-md font-bold text-slate-800 uppercase"
						on:click={() => (playerList = playerList.filter((p) => p.id !== player.id))}
						><i class="material-symbols-outlined">remove</i></button
					>
					<div
						class="flex justify-between gap-8 py-2 px-4 bg-slate-500 font-semibold rounded-md w-full"
					>
						<span>{player.name}</span>
					</div>
				</div>
			{/each}
		</div>
		<button
			class="p-2 bg-lime-500 rounded-md font-bold text-slate-800 uppercase"
			on:click={matchPlayers}>Match</button
		>
	</div>
	<div class="flex flex-col gap-2 w-60">
		<div class="flex justify-between gap-8 py-2 px-4 bg-sky-500 rounded-md font-bold">
			<span>Team 1</span>
            <span>{`${team1.reduce((acc, curr) => acc + curr.elo, 0)/5} elo`}</span>
		</div>
		{#each team1 as player}
			<div class="flex justify-between gap-8 py-2 px-4 bg-slate-500 rounded-md font-bold">
				<span>{player.name}</span>
			</div>
		{/each}
	</div>
	<div class="flex flex-col gap-2 w-60">
		<div class="flex justify-between gap-8 py-2 px-4 bg-rose-500 rounded-md font-bold">
			<span>Team 2</span>
            <span>{`${team2.reduce((acc, curr) => acc + curr.elo, 0)/5} elo`}</span>
		</div>
		{#each team2 as player}
			<div class="flex justify-between gap-8 py-2 px-4 bg-slate-500 rounded-md font-bold">
				<span>{player.name}</span>
			</div>
		{/each}
	</div>
</div>
