<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';

	import * as Card from "$lib/components/ui/card/index.js";
	import { Button } from '$lib/components/ui/button';

	import Calendar from 'lucide-svelte/icons/calendar';
	import Users from 'lucide-svelte/icons/users';
	import Lightbulb from 'lucide-svelte/icons/lightbulb';
	import Megaphone from 'lucide-svelte/icons/megaphone';
	import BookOpenText from 'lucide-svelte/icons/book-open-text';
	import CircleAlert from 'lucide-svelte/icons/circle-alert';

	const departments = [
		{
			name: m.dep_tech(),
			description: m.dep_tech_desc(),
			icon: Lightbulb
		},
		{
			name: m.dep_events(),
			description: m.dep_events_desc(),
			icon: Calendar
		},
		{
			name: m.dep_marketing(),
			description:
				m.dep_marketing_desc(),
			icon: Megaphone
		},
		{
			name: m.dep_research(),
			description:
				m.dep_research_desc(),
			icon: BookOpenText
		},
		{
			name: m.dep_sales(),
			description:
				m.dep_sales_desc(),
			icon: CircleAlert
		}
	];
</script>

<main class="container mx-auto flex-grow px-4 py-8">
	<h1 class="mb-8 text-center text-4xl font-bold">{m.about_title()}</h1>

	<section class="mb-12">
		<p class="mb-8 text-center text-xl">
			{m.about_description()}
		</p>
	</section>

	<section class="grid grid-cols-1 gap-8 md:grid-cols-2">
		{#each departments as dept}
			<Card.Root>
				<Card.Header>
					<Card.Title class="flex items-center">
						<span class="mr-2 h-6 w-6"> <dept.icon /></span>
						{dept.name}</Card.Title
					>
				</Card.Header>
				<Card.Content>
					<p>{dept.description}</p>
				</Card.Content>
			</Card.Root>
		{/each}
	</section>

	<section class="my-12">
		<p class="mb-8 text-center font-semibold text-2xl">
			Supported by:
		</p>
		<div class="flex w-full justify-center ">
			<div class="w-[220px] ">
				<a href="https://www.hetzner.com/" target="_blank" rel="noreferrer nofollow">
					<img src="/hetzner-logo.svg" alt="Hetzner Logo" />
				</a>
			</div>
			
		</div>
	</section>

	
</main>
