<header class="w-full bg-slate-600 p-4 flex justify-center">
    <a href="/" class="header-link">Leaderboard</a>
</header>
<slot />

<style lang="postcss">
	.header-link {
		@apply text-4xl font-bold text-slate-500 uppercase hover:text-slate-400 hover:border-slate-400 border-b-4 border-slate-500 rounded-md
	}
</style>