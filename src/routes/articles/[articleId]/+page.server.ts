import { config } from '$lib/config';
import * as m from '$lib/paraglide/messages.js';
import { pb } from '$lib/pocketbase';
import { error } from '@sveltejs/kit';

export async function load({ params, fetch }) {
	const getArticle = async () => {
		try {
			const article = await pb
				.collection('articles')
				.getOne(params.articleId, { expand: 'author' });
			// console.log(article)

			const updateViews = async () => {
				const response = await fetch('/api/articleviews', {
					method: 'POST',
					body: JSON.stringify({ 
						id: params.articleId,
						views: article.views
					}),
					headers: {
						'Content-Type': 'application/json'
					}
				});
				return await response.json();
			};

			const article2 = {...article, views: updateViews()}

			return article2;
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
