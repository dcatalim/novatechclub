import { pb } from '$lib/pocketbase';
import { error, json } from '@sveltejs/kit';
import { PB_ADM_EMAIL, PB_ADM_PW } from '$env/static/private';
import { PUBLIC_PB_HOST } from '$env/static/public';
import PocketBase from 'pocketbase';

const pb = new PocketBase(PUBLIC_PB_HOST);

await pb.admins.authWithPassword(PB_ADM_EMAIL, PB_ADM_PW);

export async function POST({ request }) {
	const { path } = await request.json();

	try {
		const record = await pb.collection('views_counter').getFullList({
			filter: `path = '${path}'`
		});

		if (record[0]) {
			await pb.collection('views_counter').update(record[0].id, { views: record[0].views + 1 });
			return json(record[0].views);
		} else {
			const data = {
				path: path,
				views: 1
			};

			const record = await pb.collection('views_counter').create(data);
			return json(record.views);
		}
	} catch (err) {
		console.log('Page view counter error: ' + err);
		throw error(404, err.message ?? 'Error');
	}
}
