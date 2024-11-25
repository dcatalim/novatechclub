import { config } from '$lib/config';
import * as m from '$lib/paraglide/messages.js';
import { pb } from '$lib/pocketbase';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const getArticle = async () => {
		try {
			const article = await pb
				.collection('articles')
				.getOne(params.articleId, { expand: 'author' });
			// console.log(article)

			await pb.collection('articles').update(article.id, { views: article.views + 1 });

			return article;
		} catch (err) {
			// console.log(err);
			throw error(404, err.message ?? 'Error');
		}
	};

	const article = await getArticle();

	const { title } = article;

	// console.log(title)

	return {
		title: `${title} | ${config.title}`,
		article: article
	};
}
