<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { formatDate } from '$lib/tools';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';

	import Calendar from 'lucide-svelte/icons/calendar';
	import Clock from 'lucide-svelte/icons/clock';
	import HoverAuthor from './HoverAuthor.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.article.title}</title>
	<meta name="author" content={data.article?.expand?.author?.name} />
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<article class="mx-auto max-w-3xl">
		<header class="mb-8">
			<h1 class="mb-4 text-4xl font-bold">{data.article?.title}</h1>
			<div class="mb-4 flex items-center justify-between">
				<HoverAuthor member={data.article.expand?.author} />

				<div class="flex items-center text-sm text-muted-foreground">
					<Calendar class="mr-1 h-4 w-4" />
					<span class="mr-4">{formatDate(data.article?.date)}</span>
					<Clock class="mr-1 h-4 w-4" />
					<span>{data.article?.readTime}</span>
				</div>
			</div>
			{#if data.article?.tags}
				<div class="mb-4 flex flex-wrap gap-2">
					{#each data.article.tags.split(';') as tag}
						<Badge variant="secondary">{tag}</Badge>
					{/each}
				</div>
			{/if}
		</header>

		<div class="prose prose-slate mb-8 max-w-none lg:prose-lg">
			<blockquote class="mt-6 border-l-2 pl-6 italic">
				{data.article?.abstract}
			  </blockquote>
			  
			{@html data.article?.text}
		</div>

		<Separator class="my-8" />
	</article>

	<footer>
		<div class="flex items-center justify-between">
			<Button variant="outline" href="/articles">{m.article_back()}</Button>
		</div>
	</footer>
</div>
