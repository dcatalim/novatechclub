import { error, json } from '@sveltejs/kit';
import pbAdmin from '$lib/server/pocketbase';

export async function POST({ request }) {
	const { id, views } = await request.json();

	try {
		const article = await pbAdmin.collection('articles').update(id, { views: views + 1 });

		return json(article.views);
	} catch (err) {
		console.log('Page view counter error: ' + err);
		return err
	}
}
