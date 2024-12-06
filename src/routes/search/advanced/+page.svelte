<script lang="ts">
	import type { PageData } from './$types';

	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input';
	import * as Table from '$lib/components/ui/table';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Badge } from '$lib/components/ui/badge';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';

	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import * as m from '$lib/paraglide/messages.js';

	import SelectAuthor from './SelectAuthor.svelte';
	import Pagination from './Pagination.svelte';

	import Search from 'lucide-svelte/icons/search';

	let { data }: { data: PageData } = $props();

	const minLength = 2;

	let input = $state($page.url.searchParams.get('query') || '');
	let author = $state($page.url.searchParams.get('author') || '');
	let sort = $state($page.url.searchParams.get('sort') || 'newest');
	let currentPage = $state(Number($page.url.searchParams.get('page') || 1));
	let perPage = $state(Number($page.url.searchParams.get('perPage') || 5));

	let query = $derived(input.trim());
	let loading = $state(false);
	let debounceTimeout: NodeJS.Timeout;
	let lastPage = $state(1);

	function updateSearchParams() {
		const searchParams = new URLSearchParams($page.url.searchParams);

		if (lastPage === currentPage) {
			currentPage = 1;
		}
		lastPage = currentPage;

		searchParams.set('author', author);
		searchParams.set('sort', sort);
		searchParams.set('page', String(currentPage));
		searchParams.set('perPage', String(perPage));

		if (query.length === 0 || query.length >= minLength) {
			searchParams.set('query', query);

			searchParams.sort();

			goto(`?${searchParams.toString()}`, { keepFocus: true, replaceState: true }).then(
				() => (loading = false)
			);
		} else return;
	}

	function handleInput() {
		loading = true;

		clearTimeout(debounceTimeout);

		debounceTimeout = setTimeout(() => {
			updateSearchParams();
		}, 500); // Adjust debounce delay as needed
	}
</script>

<main class="container mx-auto flex-grow px-4 py-8">
	<h1 class="mb-8 text-center text-4xl font-bold">Advanced Articles Search Filter</h1>
	<section class="mb-12">
		<div class="max-w-8xl mx-auto grid grid-cols-1 gap-4 lg:grid-cols-6">
			<div class="w-full md:mt-12">
				<SelectAuthor bind:author bind:loading submit={handleInput} dataAuthors={data.authors} />
			</div>

			<div class="w-full lg:col-span-5">
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
							bind:value={input}
							oninput={handleInput}
						/>
					</div>
					<Button onclick={handleInput} disabled={loading}>Search</Button>
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
								<DropdownMenu.RadioGroup bind:value={sort} onValueChange={handleInput}>
									<DropdownMenu.RadioItem value="newest">Newest</DropdownMenu.RadioItem>
									<DropdownMenu.RadioItem value="oldest">Oldest</DropdownMenu.RadioItem>
								</DropdownMenu.RadioGroup>
							</DropdownMenu.Group>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</div>
				<Table.Root>
					<Table.Header>
						<Table.Row>
							<Table.Head class="w-[150px]">Author</Table.Head>
							<Table.Head>Title</Table.Head>
							<Table.Head class="hidden sm:table-cell	">Abstract</Table.Head>
							<Table.Head>Tags</Table.Head>
							<Table.Head class="text-right">Views</Table.Head>
						</Table.Row>
					</Table.Header>

					{#if loading}
						<!-- <Table.Caption>Loading...</Table.Caption> -->
						<Table.Body>
							{#each Array(perPage ?? 5) as _, i (i)}
								<Table.Row>
									{#each Array(5) as _, i (i)}
										<Table.Cell><Skeleton class="h-4 w-full" /></Table.Cell>
									{/each}
								</Table.Row>
							{/each}
						</Table.Body>
					{:else}
						{#await data.results then results}
							{#if results?.count === 0}
								<Table.Caption>No results found</Table.Caption>
							{:else}
								<Table.Body>
									{#each results?.items as result}
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
								</Table.Body>
							{/if}
						{:catch error}
							<Table.Caption>Error: {error}</Table.Caption>
						{/await}
					{/if}
				</Table.Root>

				{#await data.results then results}
					<Pagination
						bind:page={currentPage}
						count={results?.count}
						{perPage}
						submit={handleInput}
					/>
				{:catch error}
					<p>Error: {error}</p>
				{/await}
			</div>
		</div>
	</section>
</main>
