<script lang="ts">
	export let playedWithPlayers: {
		id: number;
		name: string;
		games: number;
		wins: number;
		losses: number;
	}[];

	let sortedListOfPlayers = playedWithPlayers;

	let curretSort = 'games-desc';
	const sortByGamesPlayed = () => {
		if (curretSort === 'games-desc') {
			sortedListOfPlayers = playedWithPlayers.sort((a, b) => a.games - b.games);
			curretSort = 'games-asc';
		} else {
			sortedListOfPlayers = playedWithPlayers.sort((a, b) => b.games - a.games);
			curretSort = 'games-desc';
		}
	};

	const sortByWinrate = () => {
		if (curretSort === 'winrate-desc') {
			sortedListOfPlayers = playedWithPlayers.sort((a, b) => a.wins / a.games - b.wins / b.games);
			curretSort = 'winrate-asc';
		} else {
			sortedListOfPlayers = playedWithPlayers.sort((a, b) => b.wins / b.games - a.wins / a.games);
			curretSort = 'winrate-desc';
		}
	};
</script>

<div
	class="bg-slate-500 border-b-4 border-emerald-500 text-xl uppercase text-emerald-500 rounded-md font-bold p-4"
>
	<span>Played with</span>
</div>
<div class="bg-slate-500 rounded-md overflow-hidden">
	<div class="grid grid-cols-4 gap-4 font-bold text-slate-800 mb-2 px-4 pt-4">
		<div class="col-span-2">Name</div>
		<button class="text-right hover:underline" on:click={sortByGamesPlayed}>Games</button>
		<button class="text-right hover:underline" on:click={sortByWinrate}>Winrate</button>
	</div>
    <div>

        {#each sortedListOfPlayers as playedWithPlayer, i}
		<div class="grid mt-1 grid-cols-4 gap-4 text-slate-800 font-bold px-4 py-1"
        class:odd={i % 2 === 0}
        class:last={i === sortedListOfPlayers.length - 1}
        >
			<a
				data-sveltekit-reload
				href={`/player/${playedWithPlayer.id}`}
				class="col-span-2 hover:underline">{playedWithPlayer.name}</a
                >
                <div class="text-right">{playedWithPlayer.games}</div>
                <div
				class="text-right"
				class:win-text={playedWithPlayer.wins / playedWithPlayer.games >= 0.5}
				class:lose-text={playedWithPlayer.wins / playedWithPlayer.games < 0.5}
                >
				{`${(Math.round((playedWithPlayer.wins / playedWithPlayer.games) * 1000) / 10).toFixed(
                    1
                    )}%`}
			</div>
		</div>
        {/each}
    </div>
</div>

<style lang="postcss">
    .odd {
        @apply bg-slate-400 bg-opacity-50;
    }
    .last {
        @apply pb-4;
    }
	.win-text {
		@apply text-lime-500;
	}
	.lose-text {
		@apply text-rose-500;
	}
</style>
