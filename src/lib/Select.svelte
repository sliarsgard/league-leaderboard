<script lang="ts">
    export let data: string[]

    export let selected: string
    let searchStr = ""
    let active: boolean

    let searchLst = data

    $: searchLst = data.filter(i => i.includes(searchStr))

    const handleSelect = (item: string) => {
        active = false
        selected = item
        searchStr = item
    }

</script>

<div class="relative" on:click|stopPropagation on:keypress>
    <input on:focus={() => active = true} bind:value={searchStr} type="text" class="p-2 rounded-md bg-slate-200 outline-none">
    {#if active}
        <div class="flex flex-col rounded-md overflow-hidden top-full absolute w-full z-10 shadow-xl">
            {#each searchLst as item}
                <button class="bg-slate-400 p-2 font-semibold overflow-hidden" on:click={() => handleSelect(item)}>
                    {item}
                </button>
            {/each}
        </div>
    {/if}
</div>

<svelte:window on:click|stopPropagation={() => active = false} />