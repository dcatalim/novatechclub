import { error, json } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { pb } from '$lib/pocketbase';
import { config } from '$lib/config';

export const load = (async ({ url }) => {
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

	const getResults = async () => {
		let filter: string = '';
		let filters: string[] = [];

		const query = url.searchParams.get('query') || '';
		const author = url.searchParams.get('author') || '';
		const sort = url.searchParams.get('sort') || 'newest';
		const perPage = Number(url.searchParams.get('perPage')) || 5;
		const page = Number(url.searchParams.get('page')) || 1;

		// if (query.length === 0) {
		// } else if (query.length >= minLength) {
		// 	filters.push(`(title~"${query}" || abstract~"${query}")`);
		// } else return;

		if (query.length > 0) {
			filters.push(`(title~"${query}" || abstract~"${query}")`);
		}

		if (author.length > 0) {
			filters.push(`author.id="${author}"`);
		}

		filter = filters.join(' && ');

		try {
			const response = await pb.collection('articles').getList(page, perPage, {
				filter: filter,
				sort: sort === 'newest' ? '-created' : '+created',
				expand: 'author'
			});

			// console.log('filter: ', filter);

			const count = response.totalItems;

			const results = response.items.map((record) => {
				return {
					id: record.id,
					views: record.views,
					author: record.expand?.author.name,
					tags: replaceTextWithMarker(record.tags, query),
					title: replaceTextWithMarker(record.title, query),
					text: getMatches(record.abstract, query)
				};
			});

			return { items: results, count };
		} catch (err) {
			// console.log(err);
			return err
			// throw error(404, err.message ?? 'Error');
		}
	};

	function replaceTextWithMarker(text: string, match: string) {
		const regex = new RegExp(match, 'gi');

		return text.replaceAll(regex, (match) => `<mark>${match}</mark>`);
	}

	function getMatches(text: string, searchTerm: string, limit = 1) {
		const regex = new RegExp(searchTerm, 'gi');
		const indexes = [];
		let matches = 0;
		let match;

		while ((match = regex.exec(text)) !== null && matches < limit) {
			indexes.push(match.index);
			matches++;
		}

		return indexes.map((index) => {
			const start = index - 20;
			const end = index + 80;
			const excerpt = text.substring(start, end).trim();
			return `...${replaceTextWithMarker(excerpt, searchTerm)}...`;
		});
	}

	return {
		title: `Advanced Search | ${config.title}`,
		results: getResults(),
		authors: await getAuthors()
	};
}) satisfies PageLoad;
