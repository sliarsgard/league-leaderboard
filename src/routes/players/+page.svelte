<script lang="ts">
	import supabase from '$lib/supabase';
	import type { PageData } from './$types';
	import ConfirmModal from './ConfirmModal.svelte';

	export let data: PageData;
	let { players } = data;

	supabase
		.channel('any')
		.on<PageData['players'][number]>(
			'postgres_changes',
			{ event: '*', schema: 'public', table: 'players' },
			(payload) => {
				console.log(payload);
				if (payload.eventType === 'INSERT') players = [...players, payload.new];
				else if (payload.eventType === 'DELETE')
					players = players.filter((player) => player.id !== payload.old.id);
				else if (payload.eventType === 'UPDATE')
					players = players.map((player) => (player.id === payload.old.id ? payload.new : player));
			}
		)
		.subscribe();

	let name = '';
	let loading = false;
	const addPlayer = async () => {
		loading = true;
		await supabase.from('players').insert({ name });
		loading = false;
		name = '';
	};
	const deletePlayer = async (playerId: number) => {
		loading = true;
		await supabase.from('players').delete().eq('id', playerId);
		loading = false;
	};

	let showConfirmModal = false;
	let playerToDelete: number | null = null;

	const confirmDeletePlayer = async () => {
		if (playerToDelete !== null) await deletePlayer(playerToDelete);
		showConfirmModal = false;
		playerToDelete = null;
	};

	const promptDeletePlayer = (playerId: number) => {
		playerToDelete = playerId;
		showConfirmModal = true;
	};
</script>

<div class="flex gap-16">
	<div class="flex flex-col gap-2">
		{#each players as player}
			<div class="flex gap-2">
				<button
					class="p-2 pb-1 flex bg-red-500 rounded-md font-bold text-slate-800 uppercase"
					on:click={() => promptDeletePlayer(player.id)}
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
	<form on:submit|preventDefault={addPlayer}>
		<div class="flex flex-col gap-2">
			<div class="flex flex-col">
				<label class="text-slate-200 font-mono font-bold uppercase" for="name">Username</label>
				<input
					disabled={loading}
					bind:value={name}
					class="p-2 rounded-md bg-slate-400 outline-none text-slate-800 font-bold"
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
<ConfirmModal
    bind:show={showConfirmModal}
    loading={loading}
    title="Remove player"
    message={`Are you sure you want to remove ${players.find(p => p.id === playerToDelete)?.name}?`}
    onCancel={() => (showConfirmModal = false)}
    onConfirm={confirmDeletePlayer}
/>
