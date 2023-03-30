<script lang="ts">
	export let show = false;
  export let loading = false;
	export let title = 'Confirm';
	export let message = 'Are you sure?';
	export let onCancel: () => void;
	export let onConfirm: () => void;
</script>

{#if show}
<div class="fixed z-10 inset-0 overflow-y-auto">
			<div
				class="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full"
			>
				<div class="px-4 py-5 sm:p-6">
					<h3 class="text-lg leading-6 font-medium text-gray-900">{title}</h3>
					<div class="mt-2 text-sm text-gray-500">{message}</div>
				</div>
				<div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
					<button
						type="button"
						class="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:text-sm"
            disabled={loading}
						on:click={onCancel}
					>
						Cancel
					</button>
					<button
						type="button"
						class="disabled:bg-red-200 ml-3 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:text-sm"
            disabled={loading}
						on:click={onConfirm}
					>
						Confirm
					</button>
				</div>
			</div>
	</div>
{/if}
