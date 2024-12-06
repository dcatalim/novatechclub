import { pb } from '$lib/pocketbase';
import type { PageLoad } from './$types';

const minLength = 2;

export const load = (async ({ url }) => {
	async function fetchResults() {
		const query = url.searchParams.get('query') || '';

		if (query.length < minLength) {
			const results: [] = [];
			
			return results;
		}

		try {
			const response = await pb.collection('articles').getList(1, 10, {
				filter: `title~"${query}" || text~"${query}"`,
				sort: '-created'
			});

			const results = response.items.map((record) => {
				return {
					id: record.id,
					title: replaceTextWithMarker(record.title, query),
					text: getMatches(record.text, query)
				};
			});

			return results;
		} catch (err) {
			console.error('Error fetching results:', err);
		}
	}

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
		results: fetchResults(),
		minLength
	};
}) satisfies PageLoad;
