import { getSummonerData } from "$lib/utils.server";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({params, fetch}) => {
    const name = params.name;
    console.log(name)
    const summonerData = await getSummonerData(name, fetch);
    return new Response(summonerData.profileIconId.toString())
}