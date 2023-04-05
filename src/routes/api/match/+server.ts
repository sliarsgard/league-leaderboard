import {error} from '@sveltejs/kit'
import type { RequestHandler } from './$types';
import type { Player } from '$lib/types/database';

export const POST = (async ({ request, locals }) => {
    const { supabase } = locals;
    const {playerIds}: {playerIds: number[]} = await request.json();
    
    const response = await supabase.from('players').select('*').in('id', playerIds);
    if (response.error) throw error(500, 'An error occurred while fetching players.');

    const teams = generateTeams(response.data);

	return new Response(JSON.stringify(teams));
}) satisfies RequestHandler;

const generateCombinations = <T>(arr: T[], size: number): T[][] => {
    const result: T[][] = [];
    const f = (active: T[], rest: T[], depth: number) => {
        if (depth === 0) {
            result.push(active);
            return;
        }

        for (let i = 0; i < rest.length; i++) {
            const current = rest[i];
            const newActive = [...active, current];
            const newRest = rest.slice(i + 1);
            f(newActive, newRest, depth - 1);
        }
    }

    f([], arr, size);
    return result;
}

const generateTeams = (players: Player[]): [Player[], Player[]] => {
    if (players.length !== 10)
        throw error(400, 'Invalid number of players.');
    
    const teamCombinations = generateCombinations(players, 5);

    let optimalTeamA: Player[] = [];
    let optimalTeamB: Player[] = [];
    let minEloDifference = Infinity;

    for (const teamA of teamCombinations) {
        const teamB = players.filter((p) => !teamA.includes(p));
        const eloDifference = Math.abs(
            teamA.reduce((acc, p) => acc + p.elo, 0) -
                teamB.reduce((acc, p) => acc + p.elo, 0)
        )

        if (eloDifference < minEloDifference) {
            minEloDifference = eloDifference;
            optimalTeamA = teamA;
            optimalTeamB = teamB;
        }
    }

    return [optimalTeamA, optimalTeamB];
}