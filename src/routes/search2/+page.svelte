<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input';

	import Search from 'lucide-svelte/icons/search';

	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	function updateSearchParams() {
		const searchParams = new URLSearchParams($page.url.searchParams);

		searchParams.set('query', query);

		searchParams.sort();

		goto(`?${searchParams.toString()}`, { keepFocus: true, replaceState: true });
	}

	let { data } = $props();

	let input = $state($page.url.searchParams.get('query') || '');
	let query = $derived(input.trim());

	let debounceTimeout: NodeJS.Timeout;

	function handleInput() {
		clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(() => updateSearchParams(), 500); // Adjust debounce delay as needed
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

			{#if query.length > 0}
				<Card.Root class="mt-2 p-3 ">
					{#if query.length < data.minLenght}
						<p class="text-sm text-muted-foreground">
							Please enter at least {data.minLenght} characters to search
						</p>
					{:else}
						{#await data.results}
							<p class="text-sm text-muted-foreground">Searching...</p>
						{:then results}
							<ul>
								{#if results.length === 0}
									<p class="text-sm text-muted-foreground">No results found</p>
								{:else}
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
								{/if}
							</ul>
						{/await}
					{/if}
				</Card.Root>
			{/if}

			<div class="justify-items-center p-2">
				<p class="text-sm text-muted-foreground">
					Or try our <a href="/search/advanced" class="font-medium hover:underline"
						>advanced article search</a
					>
				</p>
			</div>
		</div>
	</section>
</main>
