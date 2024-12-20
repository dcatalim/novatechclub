<script lang="ts">
	import { i18n } from '$lib/i18n';
	import type { AvailableLanguageTag } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages.js';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';

	import Globe from 'lucide-svelte/icons/globe';
	import Phone from 'lucide-svelte/icons/phone';

	function switchToLanguage(newLanguage: AvailableLanguageTag) {
		const canonicalPath = i18n.route($page.url.pathname);
		const localisedPath = i18n.resolveRoute(canonicalPath, newLanguage);
		goto(localisedPath);
	}

	const navItems = [
		{ label: m.about(), href: '/about' },
		{ label: m.projects(), href: '/projects' },
		{ label: m.events(), href: '/events' },
		{ label: m.articles(), href: '/articles' }
	];
</script>

<div class="flex flex-row items-center gap-4">
	<ul class="flex space-x-4">
		{#each navItems as item}
			<li><a href={item.href} class="hover:underline">{item.label}</a></li>
		{/each}
	</ul>

	<DropdownMenu.Root>
		<DropdownMenu.Trigger class={buttonVariants({ variant: 'ghost', size: 'icon' })}>
			<Globe class="h-[1.2rem] w-[1.2rem]" />
			<span class="sr-only">Toggle Language</span>
		</DropdownMenu.Trigger>
		<DropdownMenu.Content align="end">
			<DropdownMenu.Item onclick={() => switchToLanguage('pt')}>Português</DropdownMenu.Item>
			<DropdownMenu.Item onclick={() => switchToLanguage('en')}>English</DropdownMenu.Item>
			<DropdownMenu.Item onclick={() => switchToLanguage('de')}>Deutsche</DropdownMenu.Item>
			<DropdownMenu.Item onclick={() => switchToLanguage('it')}>Italiano</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>

	<Button variant="secondary" href="/contacts">
		{m.contacts()}
		<Phone class="mr-2 size-4" />
	</Button>
</div>
