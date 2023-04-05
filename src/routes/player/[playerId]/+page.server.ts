import type { Champion, Game, PlayerGameData } from '$lib/types';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { ChartData, ChartOptions, Point } from 'chart.js';

export interface PlayerPageGameData extends PlayerGameData {
	games: Game;
}

export const load = (async ({ params, locals }) => {
	const { supabase } = locals;
	const playerId = parseInt(params.playerId);
	if (isNaN(playerId)) throw error(404, 'Player not found');
	const player = await supabase.from('players').select('*').eq('id', playerId).single();
	if (!player.data) throw error(404, 'Player not found');
	const playerGameData = await supabase
		.from('player_game_data')
		.select('*, games(*)')
		.eq('player_id', playerId)
		.returns<PlayerPageGameData[]>()
		.limit(1, { foreignTable: 'games' })
		.order('created_at', { ascending: false });
		
	const url =
		'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-summary.json';
	const championData = await fetch(url, { method: 'GET' });
	const champions: Champion[] = await championData.json();

	//@ts-expect-error - this is a bug in the supabase typings
	if (playerGameData.data === null) playerGameData.data = [] as PlayerPageGameData[];
	else if (!playerGameData.data.length)
		//@ts-expect-error - this is a bug in the supabase typings
		playerGameData.data = [playerGameData.data as PlayerPageGameData];

	const eloData = playerGameData.data.map((game) => game.elo_change).slice().reverse();
	const eloOverTime = [
		1000,
		...eloData.reduce((acc: number[], cur) => {
			acc.push((acc[acc.length - 1] || 1000) + cur);
			return acc;
		}, [])
	];
	const gameNumbers = [0, ...playerGameData.data.map((_, index) => index + 1)];
	const chart = getChart(eloOverTime, gameNumbers);

	const players = await supabase.from('players').select('*');
	let playedWith: { player: number; wins: number; losses: number }[] = [];
	const getGames = playerGameData.data.map((game) =>
		supabase.from('games').select('*, player_game_data(*)').eq('id', game.game_id).single()
	);
	const games = await Promise.all(getGames);

	if (players.data === null) throw error(404, 'Players not found');
	const playedWithPlayers = (
		players.data
			.map((player) => {
				if (player.id === playerId) return;
				const [wins, losses] = games.reduce(
					(acc, game) => {
						if (!game.data) return acc;
						//@ts-expect-error - this is a bug in the supabase typings
						if (game.data.player_game_data?.every((player) => player.player_id !== playerId))
							return acc;
						//@ts-expect-error - this is a bug in the supabase typings
						const profilePlayer = game.data.player_game_data?.find(
							//@ts-expect-error - this is a bug in the supabase typings
							(player) => player.player_id === playerId
						);
						const blueTeam = profilePlayer?.blue_team;
						//@ts-expect-error - this is a bug in the supabase typings
						const playerData = game.data.player_game_data?.find((p) => p.player_id === player.id);
						const sameTeam = playerData?.blue_team === blueTeam;
						if (!sameTeam) return acc;
						if (game.data.blue_team_win && blueTeam) return [acc[0] + 1, acc[1]];
						if (!game.data.blue_team_win && !blueTeam) return [acc[0] + 1, acc[1]];
						return [acc[0], acc[1] + 1];
					},
					[0, 0]
				);
				return {
					id: player.id,
					name: player.name,
					games: wins + losses,
					wins,
					losses
				};
			})
			.filter((p) => p !== undefined) as {
			id: number;
			name: string;
			games: number;
			wins: number;
			losses: number;
		}[]
	)
		.filter((p) => p.games > 0)
		.sort((a, b) => b.games - a.games);

	games.forEach((game) => {
		//@ts-expect-error - this is a bug in the supabase typings
		const blueTeam = game.data?.player_game_data?.find(
			//@ts-expect-error - this is a bug in the supabase typings
			(player) => player.player_id === playerId
		)?.blue_team;
		//@ts-expect-error - this is a bug in the supabase typings
		game.data?.player_game_data?.forEach((player) => {
			if (player.player_id === playerId) return;
			if (blueTeam === player.blue_team) {
				if (playedWith.some((p) => p.player === player.player_id))
					playedWith = playedWith.map((p) => {
						if (p.player !== player.player_id) return p;
						if (game.data.blue_team_win && player.blue_team) return { ...p, wins: p.wins + 1 };
						if (!game.data.blue_team_win && !player.blue_team) return { ...p, wins: p.wins + 1 };
						return { ...p, losses: p.losses + 1 };
					});
				else if (game.data.blue_team_win && player.blue_team)
					playedWith.push({ player: player.player_id, wins: 1, losses: 0 });
				else if (!game.data.blue_team_win && !player.blue_team)
					playedWith.push({ player: player.player_id, wins: 1, losses: 0 });
				else playedWith.push({ player: player.player_id, wins: 0, losses: 1 });
			}
			playedWith.push({ player: player.player_id, wins: 0, losses: 0 });
		});
	});

	return {
		champions,
		player: player.data,
		playerGameData: playerGameData.data as PlayerPageGameData[],
		chart,
		playedWithPlayers
	};
}) satisfies PageServerLoad;

const getChart = (
	data: number[],
	labels: number[]
): { options: ChartOptions<'line'>; data: ChartData<'line', (number | Point)[], unknown> } => {
	return {
		options: {
			scales: {
				x: {
					type: 'linear',
					title: {
						display: true,
						color: '#000',
						text: 'Games'
					},
					ticks: {
						stepSize: 1,
						precision: 0,
						color: '#000'
					},
					grid: { color: '#3335' }
				},
				y: {
					grid: { color: '#3335' },
					ticks: { color: '#000', stepSize: 50 }
				}
			},
			plugins: {
				legend: { display: false },
				title: {
					text: 'ELO',
					display: true,
					color: 'rgb(30,41,59)',
					font: {
						size: 20
					},
					align: 'center'
				}
			},
			maintainAspectRatio: false
		},
		data: {
			labels: labels,
			datasets: [
				{
					label: 'Elo Over Time',
					data: data,
					borderColor: 'rgb(14 165 233)',
					backgroundColor: 'rgb(14 165 233)',
					borderWidth: 2,
					tension: 0
				}
			]
		}
	};
};
