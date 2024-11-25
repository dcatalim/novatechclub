<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import HoverMember from '$lib/ui/HoverMember.svelte';

	import * as Card from "$lib/components/ui/card/index.js";
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';

	import GitBranch from 'lucide-svelte/icons/git-branch';
	import ArrowUpRight from 'lucide-svelte/icons/arrow-up-right';
	import Search from 'lucide-svelte/icons/search';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';

	let { data } = $props();

	let search = $state('');

	let filtered = $derived.by(() => {
		const searchQuery = search;

		return data.projects.then((r) => {
			const projects = r.map((project) => ({
				...project,
				searchTerms: `${project.title} ${project.status} ${project.description} ${project.tech}`
			}));

			const filteredArticles = projects.filter((item) => {
				return item.searchTerms.toLowerCase().includes(searchQuery);
			});

			return filteredArticles;
		});
	});
</script>

<main class="container mx-auto flex-grow px-4 py-8">
	<h1 class="mb-8 text-center text-4xl font-bold">{m.projects_title()}</h1>

	<section class="mb-12">
		<p class="mb-8 text-center text-xl">
			{m.projects_description()}
		</p>
		<div class="mx-auto max-w-md">
			<div class="relative">
				<Search class="absolute left-2 top-1/2 -translate-y-1/2 transform text-muted-foreground" />
				<Input
					type="text"
					placeholder={m.projects_input_placeholder()}
					class="pl-10"
					bind:value={search}
				/>
			</div>
		</div>
	</section>

	{#await filtered}
		<div class="w-full justify-items-center">
			<LoaderCircle class="animate-spin" />
		</div>
	{:then projects}
		<section class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
			{#each projects as project}
				<Card.Root>
					<Card.Header>
						<Card.Title>{project.title}</Card.Title>
						<Card.Description>{m.project_status()}: {project.status}</Card.Description>
					</Card.Header>
					<Card.Content>
						<p class="mb-4">{project.description}</p>
						<div class="mb-4 flex flex-wrap gap-2">
							{#each project.tech.split(';') as tech}
								<span class="rounded bg-secondary px-2 py-1 text-sm text-secondary-foreground"
									>{tech}</span
								>
							{/each}
						</div>

						<p class="text-sm text-muted-foreground">
							{m.project_team_members()}:
						</p>

						<div class="m-2 flex flex-row gap-2">
							{#each project.expand?.team as member}
								<HoverMember {member} />
							{/each}
						</div>
					</Card.Content>
					<Card.Footer>
						<Button variant="outline" href="/projects/{project.id}">
							{m.project_button()}
							<ArrowUpRight class="ml-2 h-4 w-4" />
						</Button>
					</Card.Footer>
				</Card.Root>
			{/each}
		</section>
	{:catch error}
		<p>{m.load_error()}: {error}</p>
	{/await}

	<section class="mt-16 text-center">
		<h2 class="mb-4 text-3xl font-bold">{m.projects_cta_title()}</h2>
		<p class="mb-8 text-xl">
			{m.projects_cta_description()}
		</p>
		<Button size="lg" href="/contacts">
			{m.projects_cta_button()}
			<GitBranch class="ml-2" />
		</Button>
	</section>
</main>
