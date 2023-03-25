<script lang="ts">
	import type { PageData } from './$types';
	import PlayerInput from './PlayerInput.svelte';
	import { setContext } from 'svelte';

	export let data: PageData;

	let winningTeam = 0;

	const { players, champions } = data;

	setContext(
		'champions',
		champions.filter((c: any) => c.id > 0)
	);

	interface PlayerGameData {
		name: string;
		champion: string;
		k: string;
		d: string;
		a: string;
	}
	const getNewPlayerData = (): PlayerGameData => {
		return { name: '', champion: '', k: '', d: '', a: '' };
	};

	let playerData = [
		getNewPlayerData(),
		getNewPlayerData(),
		getNewPlayerData(),
		getNewPlayerData(),
		getNewPlayerData(),
		getNewPlayerData(),
		getNewPlayerData(),
		getNewPlayerData(),
		getNewPlayerData(),
		getNewPlayerData()
	];

	const handleAddGame = async () => {
		const team1 = playerData.filter((_, i) => i < 5);
		const team2 = playerData.filter((_, i) => i >= 5);
		fetch('/api/addgame', {
			method: 'POST',
			body: JSON.stringify({
				winningTeam: winningTeam === 1 ? team1 : team2,
				losingTeam: winningTeam === 1 ? team2 : team1
			})
		});
	};

	let playersToSelect = players
		.filter((player) => !playerData.some((p) => p.name === player.name))
		.map((p) => p.name) as string[];
	const filterPlayers = () => {
		playersToSelect = players
			.filter((player) => !playerData.some((p) => p.name === player.name))
			.map((p) => p.name) as string[];
	};
	setContext('filterPlayers', filterPlayers)
</script>

<div class="flex flex-col gap-24">
	<div class="flex gap-24 w-2/3 self-center">
		<div class="flex flex-col gap-8 w-1/2">
			<p class="text-center text-xl text-slate-100 font-bold">Team 1</p>
			<PlayerInput {playersToSelect} playerData={playerData[0]} />
			<PlayerInput {playersToSelect} playerData={playerData[1]} />
			<PlayerInput {playersToSelect} playerData={playerData[2]} />
			<PlayerInput {playersToSelect} playerData={playerData[3]} />
			<PlayerInput {playersToSelect} playerData={playerData[4]} />
		</div>
		<div class="flex flex-col gap-8 w-1/2">
			<p class="text-center text-xl text-slate-100 font-bold">Team 2</p>
			<PlayerInput {playersToSelect} playerData={playerData[5]} />
			<PlayerInput {playersToSelect} playerData={playerData[6]} />
			<PlayerInput {playersToSelect} playerData={playerData[7]} />
			<PlayerInput {playersToSelect} playerData={playerData[8]} />
			<PlayerInput {playersToSelect} playerData={playerData[9]} />
		</div>
	</div>
	<div class="w-2/3 flex self-center">
		<div class="w-1/3 flex justify-end">
			<button
				class="p-2 bg-slate-400 rounded-lg w-full text-lg font-bold"
				class:win={winningTeam === 1}
				on:click={() => (winningTeam = 1)}>Team 1</button
			>
		</div>
		<div class="w-1/3 text-center p-2 uppercase text-lime-500 font-bold text-xl">Winning Team</div>
		<div class="w-1/3 flex justify-start">
			<button
				class="p-2 bg-slate-400 rounded-lg w-full text-lg font-bold"
				class:win={winningTeam === 2}
				on:click={() => (winningTeam = 2)}>Team 2</button
			>
		</div>
	</div>
	<div class="w-2/3 flex self-center justify-center mb-24">
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
