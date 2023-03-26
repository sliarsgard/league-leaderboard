<script lang="ts">
    export let forId: string = '';
</script>

<label class="uppercase text-slate-200 font-mono text-sm font-bold" for={forId}><slot/></label>
