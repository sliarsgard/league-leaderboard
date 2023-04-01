import {error} from '@sveltejs/kit'
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ url, locals }) => {
	const { supabase, getSession } = locals;
	const session = await getSession();
	if (!session) throw error(401, 'Unauthorized');

	const name = url.searchParams.get('name');
	if (!name) throw error(400, 'No name provided.');

	await supabase.from('players').insert({name})
	return new Response();
}
