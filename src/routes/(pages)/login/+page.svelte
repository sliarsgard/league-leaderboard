<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';

    export let data: PageData
    const { supabase } = data
	let email = '';
	let password = '';

	const login = async () => {
		const { error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});
		if (!error) goto('/')
	};
</script>

<div class="flex flex-col items-center gap-16 mb-8">
	<div
		class="bg-slate-500 w-[25rem] flex justify-between border-b-4 border-teal-400 text-2xl text-teal-400 uppercase rounded-md font-bold p-4"
	>
		<span class="text-center w-full">Login</span>
	</div>
	<form on:submit|preventDefault={login} class="flex flex-col w-[25rem] gap-4 p-8 bg-slate-500 rounded-md">
		<div class="flex flex-col">
			<label class="font-mono uppercase font-bold text-slate-800" for="email">Email</label>
			<input
				class="bg-slate-400 rounded-md p-2 text-lg text-slate-800 font-semibold outline-none"
                bind:value={email}
				type="email"
				name="email"
				id="email"
			/>
		</div>
		<div class="flex flex-col">
			<label class="font-mono uppercase font-bold text-slate-800" for="password">Password</label>
			<input
				class="bg-slate-400 rounded-md p-2 text-lg text-slate-800 font-semibold outline-none"
                bind:value={password}
				type="password"
				name="password"
				id="password"
			/>
		</div>
		<button class="bg-teal-400 p-2 rounded-md uppercase font-bold text-slate-800" type="submit"
			>Login</button
		>
	</form>
</div>
