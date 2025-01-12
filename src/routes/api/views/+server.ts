import { error, json } from '@sveltejs/kit';
import pbAdmin from '$lib/server/pocketbase';


export async function POST({ request }) {
	const { path } = await request.json();

	try {
		const record = await pbAdmin.collection('views_counter').getFullList({
			filter: `path = '${path}'`
		});

		if (record[0]) {
			await pbAdmin.collection('views_counter').update(record[0].id, { views: record[0].views + 1 });
			return json(record[0].views);
		} else {
			const data = {
				path: path,
				views: 1
			};

			const record = await pbAdmin.collection('views_counter').create(data);
			return json(record.views);
		}
	} catch (err) {
		console.log('Page view counter error: ' + err);
		return err
	}
}
