import { config } from '$lib/config';
import * as m from '$lib/paraglide/messages.js';
import type { PageLoad } from './$types';

export const load = (async () => {
    return {
		title: `${m.search_engine()} | ${config.title}`,
    };
}) satisfies PageLoad;