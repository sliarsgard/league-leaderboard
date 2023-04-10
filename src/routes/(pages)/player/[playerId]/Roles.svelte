<script lang="ts">
	import type { PlayerPageGameData } from "./+page.server";

    export let playerGameData: PlayerPageGameData[];
    
	const positionImageUrl = (position: string) =>
		`https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-career-stats/global/default/position_${position}.png`;

        const getLongPos = (position: string) => {
            if (position === 'jng') return 'jungle';
            if (position === 'bot') return 'bottom';
            if (position === 'sup') return 'support';
            else return position;
        }
    const positions = [
        'top',
        'jng',
        'mid',
        'bot',
        'sup'
    ];

    const getGames = (position: string) => 
        playerGameData.reduce((acc, cur) => cur.role === position ? acc + 1 : acc, 0);

    const getWinrate = (position: string) => {
        const games = getGames(position);
        const wins = playerGameData.reduce((acc, cur) => cur.role === position && cur.elo_change >= 0 ? acc + 1 : acc, 0);
        if (games === 0) return '-';
        return `${(wins / games * 100).toFixed(1)}%`;
    }
</script>

<div
	class="bg-slate-500 border-b-4 border-rose-500 text-xl uppercase text-rose-400 rounded-md font-bold p-4"
>
	<span>Roles</span>
</div>
<div class="flex flex-col gap-2">
    {#each positions as position}
		<div class="bg-slate-500 p-2 rounded-md flex gap-2 text-slate-800 align-middle text-lg font-bold">
            <img
				src={positionImageUrl(getLongPos(position))}
				alt={getLongPos(position)}
				class="w-10 h-10 object-cover"
			/>
            <div class="flex justify-between w-full ml-4">
				<div class="flex flex-col justify-center">
					<span>{`${getGames(position)} ${getGames(position) === 1 ? 'game' : 'games'}`}</span>
				</div>
				<div class="flex flex-col justify-center text-right">
					<span>{getWinrate(position)}</span>
				</div>
			</div>
        </div>
    {/each}
</div>
