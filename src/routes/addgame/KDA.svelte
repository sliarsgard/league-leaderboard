<script lang="ts">
	import Label from '$lib/components/Label.svelte';

	export let k: number;
	export let d: number;
	export let a: number;

	let kInput = '';
	let dInput = '';
	let aInput = '';

	const handleInput = (value: string, setInput: (value: string) => void) => {
		if (value === '') return 0;
		const num = parseInt(value);
		const newVal = isNaN(num) ? '' : num.toString();
		setInput(newVal);
		return parseInt(newVal);
	};

	$: k = handleInput(kInput, (value: string) => (kInput = value));
	$: d = handleInput(dInput, (value: string) => (dInput = value));
	$: a = handleInput(aInput, (value: string) => (aInput = value));
</script>

<div>
	<div class="flex gap-2 w-full mb-1">
		<Label forId="k">K/D/A</Label>
	</div>
	<div class="flex gap-2 w-full">
		<input
			bind:value={kInput}
			type="text"
			class="w-1/3 text-center p-1 outline-none rounded-md bg-slate-200"
		/>
		<input
			bind:value={dInput}
			type="text"
			class="w-1/3 text-center p-1 outline-none rounded-md bg-slate-200"
		/>
		<input
			bind:value={aInput}
			type="text"
			class="w-1/3 text-center p-1 outline-none rounded-md bg-slate-200"
		/>
	</div>
</div>
