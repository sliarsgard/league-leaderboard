import supabase from '$lib/supabase';
import type { RequestHandler } from './$types';

export const POST = (async ({ url }) => {
	const name = url.searchParams.get('name');

	await supabase.from('players').insert({name})

	return new Response();
}) satisfies RequestHandler;
