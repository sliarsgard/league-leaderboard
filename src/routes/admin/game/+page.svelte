<script lang="ts">
	import type { PlayerGameData } from '$lib/types/database';
	import { getChampionImageUrl, getTier } from '$lib/util';
	import type { PageData } from './$types';
	export let data: PageData;
	let { games, players } = data;

	const getPlayerName = (id: number) => players.find((p) => p.id === id)?.name || 'Anonymous';

	const roleOrder = ['top', 'jng', 'mid', 'bot', 'sup'];
	const sortPlayersByRole = (a: PlayerGameData, b: PlayerGameData) =>
		roleOrder.indexOf(a.role) - roleOrder.indexOf(b.role);
</script>

<div class="flex flex-col gap-4 mx-auto py-8">
    <div class="flex justify-between items-center">
        <h1 class="text-3xl font-semibold">Games</h1>
        <a href="/admin/game/add" class="p-2 bg-lime-500 rounded-md font-bold uppercase hover:bg-lime-400">Add Game</a>
    </div>
	{#each games as game}
		<a class="rounded-md overflow-hidden mb-4" href={`/admin/game/${game.id}`}>
			<div class="bg-slate-500 p-4 hover:bg-slate-400">
				<div class="flex items-center justify-between mb-2">
					<h2 class="text-lg font-semibold text-gray-800">Game ID: {game.id}</h2>
					<span class="text-sm text-gray-600">{game.created_at}</span>
				</div>
				<div class="flex gap-4">
					{#each ['blue', 'red'] as team}
						<div class="flex flex-col space-y-2">
							{#each game.player_game_data
								.sort(sortPlayersByRole)
								.filter((player) => player.team === team) as player}
								<div
									class={`flex rounded-md w-60 items-center pr-2 overflow-hidden ${player.win ? 'bg-lime-500' : 'bg-rose-500'}`}
								>
									<img
										src={getChampionImageUrl(player.champion)}
										alt=""
										class="w-10 h-10 object-cover mr-2"
									/>
									<div class="flex flex-col w-2/3">
										<span class="font-semibold text-slate-800"
											>{getPlayerName(player.player_id)}</span
										>
										<span class="text-xs text-slate-800">
											{getTier(players.find((p) => p.id === player.player_id)?.elo || 1000)}
										</span>
									</div>
									<div class="text-sm text-right w-1/3 text-slate-800">
										{player.kills}/{player.deaths}/{player.assists}
									</div>
								</div>
							{/each}
						</div>
					{/each}
				</div>
			</div>
		</a>
	{/each}
</div>
