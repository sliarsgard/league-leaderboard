<script lang="ts">
	import type { PageData } from './$types';
	import PlayerInput from './PlayerInput.svelte';
	import { setContext } from 'svelte';
	import type { Player, PlayerGameDataInput, PlayerWithIcon, Role } from '$lib/types';
	import SelectChampion from './SelectChampion.svelte';
	import BanChampionSelect from './BanChampionSelect.svelte';

	export let data: PageData;

	let winningTeam = 0;

	let { players, champions, supabase, session } = data;

	let bans = {
		blue: [-1, -1, -1, -1, -1],
		red: [-1, -1, -1, -1, -1]
	};

	setContext('champions', champions);

	const getNewPlayerData = (role: Role, team: 'blue' | 'red'): PlayerGameDataInput => {
		return { id: 0, champion: -1, team, role, k: 0, d: 0, a: 0 };
	};
	const ROLES: Role[] = ['top', 'jng', 'mid', 'bot', 'sup'];

	const loadData = () => {
		supabase
			.channel('any')
			.on<Player>(
				'postgres_changes',
				{ event: 'INSERT', schema: 'public', table: 'players' },
				(payload) => {
					const newPlayer: PlayerWithIcon = {
						...payload.new,
						profileIconId: 0
					};
					players = [...players, newPlayer];
				}
			)
			.subscribe();
	};

	const generatePlayerDataArray = () => {
		const arr = [];
		for (let i = 0; i < 10; i++) {
			const role = ROLES[i % 5];
			const team = i < 5 ? 'blue' : 'red';
			arr.push(getNewPlayerData(role, team));
		}
		return arr;
	};

	let playerData = generatePlayerDataArray();

	const handleAddGame = async () => {
		const players = playerData.map((player, i) => {
			return {
				...player,
				won: (i < 5 && winningTeam === 1) || (i >= 5 && winningTeam === 2)
			};
		});

		await fetch('/api/addgame', {
			method: 'POST',
			body: JSON.stringify({
				players,
				bans
			})
		});
	};

	$: playersToSelect = players
		.filter((player) => !playerData.some((p) => p.id === player.id))
		.sort((a, b) => {
			if (b.name.toLowerCase() > a.name.toLowerCase()) return -1;
			if (b.name.toLowerCase() < a.name.toLowerCase()) return 1;
			return 0;
		});
	const filterPlayers = () => {
		playersToSelect = players
			.filter((player) => !playerData.some((p) => p.id === player.id))
			.sort((a, b) => {
				if (b.name.toLowerCase() > a.name.toLowerCase()) return -1;
				if (b.name.toLowerCase() < a.name.toLowerCase()) return 1;
				return 0;
			});
	};

	setContext('filterPlayers', filterPlayers);

	$: if (session) loadData();
</script>

<div class="flex flex-col items-center px-8">
	<p class="text-lime-500 text-4xl font-bold uppercase mb-4">Add Game</p>

	<div class="grid grid-cols-2 gap-6">
		{#each [0, 5] as teamStartIndex (teamStartIndex)}
			<div class="flex flex-col gap-4 p-4 bg-slate-500 rounded-md">
				<p class="text-xl font-bold uppercase text-center">
					{teamStartIndex === 0 ? 'Blue Team' : 'Red Team'}
				</p>
				<div class="flex justify-between p-4 rounded-md bg-slate-500 w-[25rem]">
					{#each Array(5)
						.fill(null)
						.map((_, i) => i) as banIndex}
						<BanChampionSelect
							bind:selectedChampion={bans[teamStartIndex === 0 ? 'blue' : 'red'][banIndex]}
						/>
					{/each}
				</div>
				<div class="flex flex-col items-center gap-4 w-[25rem]">
					{#each Array(5)
						.fill(null)
						.map((_, i) => i + teamStartIndex) as playerIndex}
						<PlayerInput
							{playersToSelect}
							playerData={playerData[playerIndex]}
							blueTeam={teamStartIndex === 0}
						/>
					{/each}
				</div>
			</div>
		{/each}
	</div>

	<div class="w-2/3 flex justify-center items-center gap-8 mt-8">
		<button
			class="p-2 bg-slate-400 rounded-lg w-1/3 text-lg font-bold"
			class:win={winningTeam === 1}
			on:click={() => (winningTeam = 1)}>Blue Team</button
		>
		<div class="text-center p-2 uppercase text-lime-500 font-bold text-xl">Winning Team</div>
		<button
			class="p-2 bg-slate-400 rounded-lg w-1/3 text-lg font-bold"
			class:win={winningTeam === 2}
			on:click={() => (winningTeam = 2)}>Red Team</button
		>
	</div>
	<div class="w-2/3 flex self-center justify-center mt-8">
		<button
			class="bg-slate-400 p-4 w-full rounded-md font-bold text-xl uppercase"
			on:click={handleAddGame}>Add game</button
		>
	</div>
</div>

<style lang="postcss">
	.win {
		@apply bg-lime-500;
	}
</style>