<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';

	import * as Sheet from '$lib/components/ui/sheet';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import Globe from 'lucide-svelte/icons/globe';
	import Menu from 'lucide-svelte/icons/menu';
	import { afterNavigate } from '$app/navigation';

	import { i18n } from '$lib/i18n';
	import type { AvailableLanguageTag } from '$lib/paraglide/runtime';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	function switchToLanguage(newLanguage: AvailableLanguageTag) {
		const canonicalPath = i18n.route($page.url.pathname);
		const localisedPath = i18n.resolveRoute(canonicalPath, newLanguage);
		goto(localisedPath);
	}

	const navItems = [
		{ label: m.about(), href: '/about' },
		{ label: m.projects(), href: '/projects' },
		{ label: m.events(), href: '/events' },
		{ label: m.articles(), href: '/articles' },
		{ label: m.contacts(), href: '/contacts' }
	];

	let open = $state(false);
	afterNavigate(() => (open = false));
</script>

<Sheet.Root bind:open>
	<Sheet.Trigger class={buttonVariants({ variant: 'ghost', size: 'icon' })}><Menu /></Sheet.Trigger>
	<Sheet.Content side="right" class="w-64">
		<nav class="mt-8 flex flex-col items-start space-y-2 text-lg">
			{#each navItems as item}
				<Button href={item.href} variant="ghost">{item.label}</Button>
			{/each}
			<DropdownMenu.Root>
				<DropdownMenu.Trigger class={buttonVariants({ variant: 'ghost' })}>
					{m.language()}
					<Globe class="h-[1.2rem] w-[1.2rem]" />
					<span class="sr-only">Toggle Language</span>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="end">
					<DropdownMenu.Item onclick={() => switchToLanguage('pt')}>Português</DropdownMenu.Item>
					<DropdownMenu.Item onclick={() => switchToLanguage('en')}>English</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</nav>
	</Sheet.Content>
</Sheet.Root>
