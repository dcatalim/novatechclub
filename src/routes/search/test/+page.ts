
export const load = async ({ url }) => {
	const getProducts = async () => {
		// Extract query parameters from the URL
		const query = url.searchParams.get('query') || '';

		// Build the API endpoint dynamically
		const apiUrl = `https://dummyjson.com/products/search?q=${query}`;

		// Fetch data from the API
		const response = await fetch(apiUrl);
		if (!response.ok) {
			throw new Error('Failed to fetch data');
		}

		console.log('aaaaaaaaaaa')

		return await response.json();
	};

	return {
		products: getProducts()
	}; // Return the data to the page
};
