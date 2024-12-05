import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { pb } from '$lib/pocketbase';

export const load = (async () => {
	const getAuthors = async () => {
		try {
			const records = await pb.collection('members').getFullList({
				sort: '-created'
			});

			return records;
		} catch (err) {
			// console.log(err);
			throw error(404, err.message ?? 'Error');
		}
	};

	return {
		authors: await getAuthors()
	};
}) satisfies PageLoad;
