<script lang="ts">
	import type { PageData } from './$types';

	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input';
	import * as Table from '$lib/components/ui/table';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Badge } from '$lib/components/ui/badge';

	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { pb } from '$lib/pocketbase';
	import * as m from '$lib/paraglide/messages.js';

	import SelectAuthor from './SelectAuthor.svelte';
	import Pagination from './Pagination.svelte';

	import Search from 'lucide-svelte/icons/search';

	let { data }: { data: PageData } = $props();

	const minLength = 1;
	const perPage = 5;

	let inputValue = $state('');
	let query = $derived(inputValue.trim());
	let results = $state([]);
	let loading = $state(false);
	let selectValue = $state('');
	let debounceTimeout: NodeJS.Timeout;
	let count = $state(0);
	let currentPage = $state(1);
	let lastPage = $state(1);
	let sort = $state('newest');

	async function updateSearchParams() {
		const searchParams = new URLSearchParams($page.url.searchParams);

		searchParams.set('query', query);
		searchParams.set('author', selectValue);
		searchParams.set('sort', sort);
		searchParams.set('page', String(currentPage));

		searchParams.sort()

		await goto(`?${searchParams.toString()}`, { keepFocus: true, replaceState: true });
	}

	async function fetchResults() {
		let filter: string = '';
		let filters: string[] = [];

		if (query.length === 0) {
		} else if (query.length >= minLength) {
			filters.push(`(title~"${query}" || abstract~"${query}")`);
		} else return;

		if (selectValue.length > 0) {
			filters.push(`author.id="${selectValue}"`);
		}

		if (lastPage === currentPage) {
			currentPage = 1
		}
		updateSearchParams();

		filter = filters.join(' && ');
		lastPage = currentPage

		loading = true;
		try {
			const response = await pb.collection('articles').getList(currentPage, perPage, {
				filter: filter,
				sort: sort === 'newest' ? '-created' : '+created',
				expand: 'author'
			});

			// console.log('filter: ', filter);

			count = response.totalItems;

			results = response.items.map((record) => {
				return {
					id: record.id,
					views: record.views,
					author: record.expand?.author.name,
					tags: replaceTextWithMarker(record.tags, query),
					title: replaceTextWithMarker(record.title, query),
					text: getMatches(record.abstract, query)
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
		debounceTimeout = setTimeout(() => fetchResults(), 500); // Adjust debounce delay as needed
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

	onMount(() => {
		// $page.url.searchParams.forEach((value, key) => console.log(key, value));

		selectValue = $page.url.searchParams.get('author') || '';
		inputValue = $page.url.searchParams.get('query') || '';
		sort = $page.url.searchParams.get('sort') || '';
		currentPage = Number($page.url.searchParams.get('page') || 1);
		fetchResults();
	});
</script>

<main class="container mx-auto flex-grow px-4 py-8">
	<h1 class="mb-8 text-center text-4xl font-bold">Advanced Articles Search Engine</h1>
	<section class="mb-12">
		<div class="max-w-8xl mx-auto grid grid-cols-1 gap-4 sm:grid-cols-6">
			<div class="w-full sm:mt-12">
				<SelectAuthor bind:selectValue bind:loading {fetchResults} dataAuthors={data.authors} />
			</div>

			<div class="col-span-5 w-full">
				<div class="flex gap-2">
					<div class="relative w-full">
						<Search
							size={16}
							class="absolute left-2 top-1/2 -translate-y-1/2 transform text-muted-foreground"
						/>
						<Input
							type="text"
							placeholder="Search..."
							class="pl-8"
							bind:value={inputValue}
							oninput={handleInput}
						/>
					</div>
					<Button onclick={fetchResults} disabled={loading}>Search</Button>
				</div>

				{#if query.length > 0 && query.length < minLength}
					<Card.Root class="mt-2 p-3 ">
						<p class="text-sm text-muted-foreground">
							Please enter at least {minLength} characters to search
						</p>
					</Card.Root>
				{/if}

				<div class="my-2 flex w-full justify-end">
					<DropdownMenu.Root>
						<DropdownMenu.Trigger
							class={buttonVariants({ variant: 'outline', size: 'sm' })}
							disabled={loading}>Sort by</DropdownMenu.Trigger
						>
						<DropdownMenu.Content class="w-36">
							<DropdownMenu.Group>
								<DropdownMenu.GroupHeading>Sort by</DropdownMenu.GroupHeading>
								<DropdownMenu.Separator />
								<DropdownMenu.RadioGroup bind:value={sort} onValueChange={fetchResults}>
									<DropdownMenu.RadioItem value="newest">Newest</DropdownMenu.RadioItem>
									<DropdownMenu.RadioItem value="oldest">Oldest</DropdownMenu.RadioItem>
								</DropdownMenu.RadioGroup>
							</DropdownMenu.Group>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</div>
				<Table.Root>
					{#if loading}
						<Table.Caption>Loading...</Table.Caption>
					{:else if results.length === 0}
						<Table.Caption>No results found</Table.Caption>
					{/if}
					<Table.Header>
						<Table.Row>
							<Table.Head class="w-[120px]">Author</Table.Head>
							<Table.Head>Title</Table.Head>
							<Table.Head class="hidden sm:flex">Abstract</Table.Head>
							<Table.Head>Tags</Table.Head>
							<Table.Head class="text-right">Views</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#if results}
							{#each results as result}
								<Table.Row>
									<Table.Cell class="font-medium"
										><a href="/articles/{result.id}" class="hover:underline">
											{result.author}
										</a></Table.Cell
									>
									<Table.Cell>
										<a href="/articles/{result.id}" class="hover:underline">
											{@html result.title}
										</a>
									</Table.Cell>
									<Table.Cell class="hidden sm:flex"
										><a href="/articles/{result.id}" class="hover:underline">
											{@html result.text}
										</a></Table.Cell
									>

									<Table.Cell
										><a href="/articles/{result.id}">
											<div class="mb-4 flex flex-wrap gap-2">
												{#each result.tags.split(';') as tag}
													<Badge variant="secondary">{@html tag}</Badge>
												{/each}
											</div>
										</a></Table.Cell
									>
									<Table.Cell class="text-right"
										><a href="/articles/{result.id}" class="hover:underline">
											{result.views}
										</a></Table.Cell
									>
								</Table.Row>
							{/each}
						{/if}
					</Table.Body>
				</Table.Root>

				{#if results.length > 0 && !loading}
					<Pagination bind:page={currentPage} bind:count {perPage} {fetchResults} />
				{/if}
			</div>
		</div>
	</section>
</main>
