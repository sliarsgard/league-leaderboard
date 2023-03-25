<script lang="ts">
	import Label from "../../lib/Label.svelte";

    export let k: string
    export let d: string
    export let a: string

    let kInput = k
    let dInput = d
    let aInput = a

    const handleInput = (value: string, setInput: (value: string) => void) => {
        if (value === '') return ''
        const num = parseInt(value)
        const newVal = isNaN(num) ? "" : num.toString()
        setInput(newVal)
        return newVal
    }

    $: k = handleInput(kInput, (value: string) => kInput = value)
    $: d = handleInput(dInput, (value: string) => dInput = value)
    $: a = handleInput(aInput, (value: string) => aInput = value)

</script>
<div>
    <div class="flex gap-2 w-full">
        <Label forId="k">K/D/A</Label>
    </div>
    <div class="flex gap-2 w-full">
        <input bind:value={kInput} type="text" class="w-1/3 text-center p-1 outline-none rounded-md bg-slate-200">
        <input bind:value={dInput} type="text" class="w-1/3 text-center p-1 outline-none rounded-md bg-slate-200">
        <input bind:value={aInput} type="text" class="w-1/3 text-center p-1 outline-none rounded-md bg-slate-200">
    </div>
</div>