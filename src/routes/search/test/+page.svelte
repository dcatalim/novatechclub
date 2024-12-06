<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	let query = $state($page.url.searchParams.get('query') || '');

	function updateSearchParams() {
		const searchParams = new URLSearchParams($page.url.searchParams);

		searchParams.set('query', query);

		searchParams.sort();

		goto(`?${searchParams.toString()}`, { keepFocus: true, replaceState: true });
	}

	let { data } = $props();
</script>

<main class="container justify-items-center">
	<!-- Search Filters -->
	<div>
		<input
			type="text"
			bind:value={query}
			placeholder="query"
			class="border-2"
			oninput={updateSearchParams}
			onsubmit={updateSearchParams}
		/>
	</div>

	{#await data.products}
		<p>LOADING</p>
	{:then result}
		<ul>
			{#each result.products as item}
				<li>{item.title} - ${item.price}</li>
			{/each}
		</ul>
	{/await}
</main>
