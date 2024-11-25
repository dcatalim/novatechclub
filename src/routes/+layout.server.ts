import type { LayoutServerLoad } from './$types';
import { config } from '$lib/config';
import * as m from '$lib/paraglide/messages.js';
import { pb } from '$lib/pocketbase';
import { error } from '@sveltejs/kit';

export const load = (({ url }) => {
	const getViewCount = async () => {
		try {
			const record = await pb
				.collection('views_counter').getFullList({
                    filter: `path = '${url.pathname}'`
                });

			if (record[0]) {
				await pb.collection('views_counter').update(record[0].id, { views: record[0].views + 1 });
				return record[0].views;

			} else {
				const data = {
					path: url.pathname,
					views: 1
				};

				const record = await pb.collection('views_counter').create(data);
				return record.views;
			}
		} catch (err) {
			console.log('Page view counter error: ' + err);
			throw error(404, err.message ?? 'Error');
		}
	};
	return {
		views: getViewCount()
	};
}) satisfies LayoutServerLoad;
