import type { RequestHandler } from './$types';

export const POST = (async ({ request }) => {
    console.log(request)
    return new Response('Game results processed successfully.', { status: 200 });
}) satisfies RequestHandler;

