<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	const { game, champImages } = data;
	const { players } = game;

	const roleNames = {
		top: 'Top',
		jng: 'Jungle',
		mid: 'Mid',
		bot: 'Bot',
		sup: 'Support'
	};

	const getImage = (champion: string) => champImages.find((c) => c.name === champion)?.url;

	const blueTeam = players.filter((player) => player.team === 'blue');
	const redTeam = players.filter((player) => player.team === 'red');
	const blueTeamWon = blueTeam.some((player) => player.won);
	const winningTeam = blueTeamWon ? 'Blue' : 'Red';
</script>

<div class="flex flex-col items-center">
	<p class="text-lime-500 text-4xl font-bold uppercase mb-4">Match Summary</p>
	<p class="text-xl font-bold uppercase mb-4">Winning Team: {winningTeam}</p>

	<div class="grid grid-cols-2 gap-6">
		<div class="flex flex-col items-center gap-4">
			<p class="text-blue-500 text-2xl font-bold uppercase mb-4">Blue Team</p>
			{#each blueTeam as player}
				<div
					class="p-4 w-full rounded-xl border-2 border-blue-400 bg-opacity-10 bg-blue-400 text-center flex flex-col gap-4"
				>
					<div class="flex items-center gap-4">
						<img src={getImage(player.champion)} alt={`${player.champion}`} class="w-16 h-16" />
						<div>
							<p class="text-xl font-bold text-slate-100">{`${player.name}`}</p>
							<p class="text-lg font-bold text-slate-100">
								{`${player.champion} - ${roleNames[player.role]}`}
							</p>
						</div>
					</div>
					<div class="flex gap-4">
						<p class="text-lg font-bold text-slate-100 w-1/2">
							<span class="font-bold">K/D/A:</span>
							{`${player.k} / ${player.d} / ${player.a}`}
						</p>
						<p class="text-lg font-bold text-slate-100 w-1/2">
							<span class="font-bold">Elo:</span>
							{`${player.prevElo} (${player.eloChange > 0 ? '+' : ''}${player.eloChange})`}
						</p>
					</div>
				</div>
			{/each}
		</div>

		<div class="flex flex-col items-center gap-4">
			<p class="text-red-500 text-2xl font-bold uppercase mb-4">Red Team</p>
			{#each redTeam as player}
				<div
					class="p-4 w-full rounded-xl border-2 border-red-400 bg-opacity-10 bg-red-400 text-center flex flex-col gap-4"
				>
					<div class="flex items-center gap-4">
						<img src={getImage(player.champion)} alt={`${player.champion}`} class="w-16 h-16" />
						<div>
							<p class="text-xl font-bold text-slate-100">{`${player.name}`}</p>
							<p class="text-lg font-bold text-slate-100">
								{`${player.champion} - ${roleNames[player.role]}`}
							</p>
						</div>
					</div>
					<div class="flex gap-4">
						<p class="text-lg font-bold text-slate-100 w-1/2">
							<span class="font-bold">K/D/A:</span>
							{`${player.k} / ${player.d} / ${player.a}`}
						</p>
						<p class="text-lg font-bold text-slate-100 w-1/2">
							<span class="font-bold">Elo:</span>
							{`${player.prevElo} (${player.eloChange > 0 ? '+' : ''}${player.eloChange})`}
						</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
