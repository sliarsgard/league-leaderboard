<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	let players = data.players;

	let name = '';
	let loading = false;
	const addPlayer = async () => {
		loading = true;
		await fetch(`/api/addplayer?name=${name}`, { method: 'POST' });
		const res = await fetch('/api/players', {
			method: 'GET',
			headers: { 'content-type': 'application/json' }
		});
		players = await res.json();
		loading = false;
		name = '';
	};
</script>

<div class="flex gap-16">
	<div>
		{#each players as player}
			<div>
				<p>{player.name}</p>
			</div>
		{/each}
	</div>
	<div class="flex flex-col gap-4">
		<div class="flex flex-col">
			<label class="text-slate-200 font-mono font-bold uppercase" for="name">Username</label>
			<input
				disabled={loading}
				bind:value={name}
				class="p-2 rounded-md bg-slate-200 outline-none"
				id="name"
				type="text"
			/>
		</div>
		<button
			disabled={loading}
			on:click={addPlayer}
			class="p-2 bg-lime-500 rounded-md font-bold text-slate-800 uppercase">Add player</button
		>
	</div>
</div>
