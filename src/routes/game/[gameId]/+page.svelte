<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
	const { game, champions, players } = data;

	const roleValues: { [key: string]: number } = {
		top: 1,
		jng: 2,
		mid: 3,
		bot: 4,
		sup: 5
	};

	const getChampionName = (id: number) => {
		const champion = champions.find((champ) => champ.id === id);
		return champion ? champion.name : 'Unknown';
	};

	const blueTeam = players
		.filter((player) => player.blue_team)
		.sort((a, b) => roleValues[a.role] - roleValues[b.role]);
	const redTeam = players
		.filter((player) => !player.blue_team)
		.sort((a, b) => roleValues[a.role] - roleValues[b.role]);
</script>

<div class="p-8 flex flex-col gap-4">
	<div
		class="rounded-md font-bold text-slate-800 uppercase p-4 text-center"
		class:win-blue={game.blue_team_win}
		class:win-red={!game.blue_team_win}
	>
		<span>{game.blue_team_win ? 'Blue Team Wins!' : 'Red Team Wins!'}</span>
	</div>
	<div class="flex gap-8">
		<div class="flex flex-col gap-4 w-full">
			<div class="rounded-md font-bold text-slate-800 uppercase p-2 text-center bg-sky-500 w-80">
				Blue Team
			</div>
			<div class="border-l-4 border-sky-500 bg-slate-500 rounded-md divide-y divide-sky-500">
				{#each blueTeam as player}
					<div class="flex items-center gap-2 p-3">
						<img
							src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${player.champion}.png`}
							alt={getChampionName(player.champion)}
							class="w-12 h-12 object-cover"
						/>
						<div class="flex flex-col justify-start">
							<a
								data-sveltekit-preload-data
								href={`/player/${player.player_id}`}
								class="font-bold hover:underline">{player.players.name}</a
							>
							<div class="font-semibold">{player.kills}/{player.deaths}/{player.assists}</div>
						</div>
					</div>
				{/each}
			</div>
			<div class="flex justify-between p-4 bg-slate-500 rounded-md">
				{#each game.bans_blue as ban}
					<div class="relative">
						<img
							src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${ban}.png`}
							alt={getChampionName(ban)}
							class="w-10 h-10 object-cover"
						/>
						<i
							class="material-symbols-outlined absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-rose-500 text-4xl text-opacity-75"
							>close</i
						>
					</div>
				{/each}
			</div>
		</div>
		<div class="flex flex-col gap-4 w-full">
			<div class="rounded-md font-bold text-slate-800 uppercase p-2 text-center bg-rose-500 w-80">
				Blue Team
			</div>
			<div class="border-r-4 border-rose-500 bg-slate-500 rounded-md divide-y divide-rose-500">
				{#each redTeam as player}
					<div class="flex items-center justify-end gap-2 p-3">
						<div class="flex flex-col justify-end">
							<a
								data-sveltekit-preload-data
								href={`/player/${player.player_id}`}
								class="font-bold hover:underline">{player.players.name}</a
							>
							<div class="text-right font-semibold">
								{player.kills}/{player.deaths}/{player.assists}
							</div>
						</div>
						<img
							src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${player.champion}.png`}
							alt={getChampionName(player.champion)}
							class="w-12 h-12 object-cover"
						/>
					</div>
				{/each}
			</div>
			<div class="flex justify-between p-4 bg-slate-500 rounded-md">
				{#each game.bans_red as ban}
					<div class="relative">
						<img
							src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${ban}.png`}
							alt={getChampionName(ban)}
							class="w-10 h-10 object-cover"
						/>
						<i
							class="material-symbols-outlined absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-rose-500 text-4xl text-opacity-75"
							>close</i
						>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>

<style lang="postcss">
	.win-blue {
		@apply bg-sky-500;
	}

	.win-red {
		@apply bg-rose-500;
	}
</style>
