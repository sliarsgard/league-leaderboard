import db from '$lib/db';
import type { RequestHandler } from './$types';

export const POST = (async ({ url }) => {
	const name = url.searchParams.get('name');
	await db.collection('players').insertOne({
		name,
		points: 0,
		w: 0,
		l: 0
	});
	return new Response();
}) satisfies RequestHandler;
