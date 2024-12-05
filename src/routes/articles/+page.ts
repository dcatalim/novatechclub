import { config } from '$lib/config';
import * as m from '$lib/paraglide/messages.js';
import { pb } from '$lib/pocketbase';
import { error } from '@sveltejs/kit';

export function load() {
	const getArticles = async () => {
		try {
			const articles = await pb.collection('articles').getFullList({
				sort: '-created',
				expand: 'author'
			});
			// console.log(articles)

			return articles;
		} catch (err) {
			// console.log(err);
			throw error(404, err.message ?? 'Error');
		}
	};

	return {
		title: `${m.articles()} | ${config.title}`,
		articles: getArticles()
	};
}
