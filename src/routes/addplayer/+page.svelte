<script lang="ts">
	import supabase from '$lib/supabase';
	import type { PageData } from './$types';

	export let data: PageData;
	let {players} = data;

	supabase
		.channel('any')
		.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'players' }, (payload) => {
			console.log('Change received!', payload);
			players = [...players, payload.new.name]
		}).subscribe();

	let name = '';
	let loading = false;
	const addPlayer = async () => {
		loading = true;
		await supabase.from('players').insert({name})
		loading = false;
		name = '';
	};
</script>

<div class="flex gap-16">
	<div>
		{#each players as player}
			<div>
				<p>{player}</p>
			</div>
		{/each}
	</div>
	<form on:submit|preventDefault={addPlayer}>
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
			type="submit"
			class="p-2 bg-lime-500 rounded-md font-bold text-slate-800 uppercase">Add player</button
			>
		</div>
	</form>
</div>
