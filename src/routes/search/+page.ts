import { config } from '$lib/config';
import type { PageLoad } from './$types';

export const load = (async () => {
    return {
		title: `Search Engine | ${config.title}`,
    };
}) satisfies PageLoad;