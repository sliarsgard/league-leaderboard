import type { RequestHandler } from './$types';
import db from '$lib/db';

export const POST = (async ({ request }) => {
    console.log(request)
    await db.collection('players').insertOne({ name: request.body })
    return new Response('Game results processed successfully.', { status: 200 });

}) satisfies RequestHandler;

