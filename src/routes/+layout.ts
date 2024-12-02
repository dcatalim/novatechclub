import type { LayoutLoad } from './$types';

export const load = (({ fetch, url }) => {
	const path = url.pathname.toString();

	const getViews = async () => {
		const response = await fetch('/api/views', {
			method: 'POST',
			body: JSON.stringify({ path }),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		return await response.json();
	};

	return {
		views: getViews()
	};
}) satisfies LayoutLoad;
