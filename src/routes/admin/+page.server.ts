import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types'

export const load = (async ({locals}) => {
	const { getSession } = locals;
	const session = await getSession();
	if (!session) throw redirect(307, '/login')

	return {}
}) satisfies PageServerLoad;
