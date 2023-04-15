<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import '../app.css';
	import type { LayoutData } from './$types';

	export let data: LayoutData;
	$: ({ supabase, session } = data);

	onMount(async () => {
		const { data } = supabase.auth.onAuthStateChange(() => {
			invalidate('supabase:auth');
		});
		return () => data.subscription.unsubscribe();
	});

	const signout = () => supabase.auth.signOut();

	
</script>

{#if session}
	<button
		on:click={signout}
		class="uppercase text-slate-500 font-mono font-bold p-1 text-xs fixed top-0 left-0"
		>Admin</button
	>
{/if}
<div class="flex flex-col items-center gap-4">
	<slot />
</div>
<svelte:head>
	<meta name="og:image" content="https://fhekdysjckiuimivvene.supabase.co/storage/v1/object/public/image/leaderboard.png" />
	<meta name="og:image:width" content="592" />
	<meta name="og:image:height" content="304" />
	<meta name="og:title" content="Avetint Leaderboard" />
</svelte:head>