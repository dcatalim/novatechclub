<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { formatDate } from '$lib/tools';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Badge } from '$lib/components/ui/badge/index.js';

	import Search from 'lucide-svelte/icons/search';
	import LoaderCicle from 'lucide-svelte/icons/loader-circle';
	import BookOpen from 'lucide-svelte/icons/book-open';

	let { data } = $props();

	let search = $state('');

	let filtered = $derived.by(() => {
		search;

		return data.articles.then((r) => {
			const articles = r.map((article) => ({
				...article,
				searchTerms: `${article.title} ${article.abstract} ${article.expand?.author.name} ${article.tags} ${formatDate(article.date)}`
			}));

			const filteredArticles = articles.filter((item) => {
				return item.searchTerms.toLowerCase().includes(search);
			});

			return filteredArticles;
		});
	});
</script>

<main class="container mx-auto flex-grow px-4 py-8">
	<h1 class="mb-8 text-center text-4xl font-bold">{m.articles_title()}</h1>

	<section class="mb-12">
		<p class="mb-8 text-center text-xl">{m.articles_description()}</p>
		<div class="mx-auto max-w-md">
			<div class="relative">
				<Search class="absolute left-2 top-1/2 -translate-y-1/2 transform text-muted-foreground" />
				<Input
					type="text"
					placeholder={m.articles_input_placeholder()}
					class="pl-10"
					bind:value={search}
				/>
			</div>

			<div class="flex justify-center p-2">
				<p class="text-sm text-muted-foreground">
					{m.search_advanced_alternative()}
					<a href="/search" class="font-medium hover:underline">{m.search_title()} <i>(beta)</i></a>
				</p>
			</div>
		</div>
	</section>

	{#await filtered}
		<div class="flex w-full justify-center
">
			<LoaderCicle class="animate-spin" />
		</div>
	{:then articles}
		<section class="grid grid-cols-1 gap-8 md:grid-cols-2">
			{#each articles as article}
				<Card.Root>
					<Card.Header>
						<Card.Title>{article?.title}</Card.Title>
						<Card.Description
							>{article?.expand?.author?.name} | {formatDate(article.date) ??
								'Not found.'}</Card.Description
						>
					</Card.Header>
					<Card.Content>
						{#if article.tags}
							<div class="mb-4 flex flex-wrap gap-2">
								{#each article.tags.split(';') as tag}
									<Badge variant="secondary">{tag}</Badge>
								{/each}
							</div>
						{/if}
						<p class="mb-4">{article?.abstract}</p>
						<p class="text-sm text-muted-foreground">
							{m.article_views()}: {article.views}
						</p>
					</Card.Content>
					<Card.Footer>
						<Button variant="outline" href="/articles/{article?.id}">
							{m.articles_button()}
							<BookOpen class="ml-2 h-4 w-4" />
						</Button>
					</Card.Footer>
				</Card.Root>
			{/each}
		</section>
	{:catch error}
		<p>Could not load records: {error}</p>
	{/await}

	<section class="mt-16 text-center">
		<h2 class="mb-4 text-3xl font-bold">{m.articles_cta_title()}</h2>
		<p class="mb-8 text-xl">{m.articles_cta_description()}</p>
		<Button size="lg" href="/contacts">
			{m.articles_cta_button()}
			<BookOpen class="ml-2" />
		</Button>
	</section>
</main>
