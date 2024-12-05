<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { pb } from '$lib/pocketbase';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input';

	import Search from 'lucide-svelte/icons/search';

	let input = $state('');
	let search = $derived(input.trim());
	let results = $state([]);
	let loading = $state(false);

	const minLenght = 2;

	let debounceTimeout: NodeJS.Timeout;

	async function fetchResults() {
		if (search.length < minLenght) {
			results = [];
			return;
		}

		loading = true;
		try {
			const response = await pb.collection('articles').getList(1, 10, {
				filter: `title~"${search}" || text~"${search}"`,
				sort: '-created'
			});
			results = response.items.map((record) => {
				return {
					id: record.id,
					title: replaceTextWithMarker(record.title, search),
					text: getMatches(record.text, search)
				};
			});
		} catch (err) {
			console.error('Error fetching results:', err);
		} finally {
			loading = false;
		}
	}

	function handleInput() {
		clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(() => fetchResults(), 300); // Adjust debounce delay as needed
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
</script>

<main class="container mx-auto flex-grow content-center px-4 py-8">
	<h1 class="mb-8 text-center text-4xl font-bold">Articles Search Engine</h1>

	<section class="mb-12">
		<div class="mx-auto max-w-lg">
			<div class="relative">
				<Search
					size={16}
					class="absolute left-2 top-1/2 -translate-y-1/2 transform text-muted-foreground"
				/>
				<Input
					type="text"
					placeholder="Search..."
					class="pl-8"
					bind:value={input}
					oninput={handleInput}
				/>
			</div>

			{#if search.length > 0}
				<Card.Root class="mt-2 p-3 ">
					{#if search.length < minLenght}
						<p class="text-sm text-muted-foreground">
							Please enter at least {minLenght} characters to search
						</p>
					{:else if loading}
						<p class="text-sm text-muted-foreground">Searching...</p>
					{:else if results}
						<ul>
							{#each results as result}
								<li>
									<a
										href="/articles/{result.id}"
										class="flex flex-col gap-2 rounded-lg p-2 hover:bg-muted"
									>
										<small class="text-sm font-medium leading-none">{@html result.title}</small>

										<p class="text-sm text-muted-foreground">{@html result.text}</p>
									</a>
								</li>
							{/each}
							{#if results.length === 0}
								<p class="text-sm text-muted-foreground">No results found</p>
							{/if}
						</ul>
					{/if}
				</Card.Root>
			{/if}

			<div class="p-2 justify-items-center">
				<p class="text-sm text-muted-foreground">Or try our <a href="/search/advanced" class="hover:underline font-medium">advanced article search</a></p>
			</div>
		</div>
	</section>
</main>
