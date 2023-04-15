<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import '../app.css';
	import type { LayoutData } from './$types';
	import htmlToImage from 'html-to-image';
	import download from 'downloadjs';

	export let data: LayoutData;
	$: ({ supabase, session } = data);

	onMount(async () => {
		const { data } = supabase.auth.onAuthStateChange(() => {
			invalidate('supabase:auth');
		});
		return () => data.subscription.unsubscribe();
	});

	const signout = () => supabase.auth.signOut();

	const createImage = async () => {
		const node = document.getElementById('leaderboard');
		if (!node) return;
		const imageUrl = await htmlToImage.toPng(node)

		download(imageUrl, 'leaderboard.png', 'image/png')
	}
</script>

{#if session}
	<button
		on:click={signout}
		class="uppercase text-slate-500 font-mono font-bold p-1 text-xs fixed top-0 left-0"
		>Admin</button
	>
	<button
		on:click={createImage}
		class="uppercase text-slate-500 font-mono font-bold p-1 text-xs fixed top-0 left-0"
	>
		Screenshot
	</button>
{/if}
<div class="flex flex-col items-center gap-4">
	<slot />
</div>
