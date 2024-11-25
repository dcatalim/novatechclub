<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { config } from '$lib/config';

	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';

	import Mail from 'lucide-svelte/icons/mail';
	import Eye from 'lucide-svelte/icons/eye';
	import Linkedin from 'lucide-svelte/icons/linkedin';
	import Instagram from 'lucide-svelte/icons/instagram';
	import Github from 'lucide-svelte/icons/github';
	import MessageCircleMore from 'lucide-svelte/icons/message-circle-more';

	const currentYear = new Date().getFullYear();

	let { views } = $props();
</script>

<footer class="container mx-auto px-4 py-8">
	<Separator class="mb-8" />
	<div class="flex flex-col items-center justify-between md:flex-row">
		<div class="mb-4 md:mb-0">
			<p>© {currentYear} {m.copyright()}</p>
			<a href="mailto:{config.email}" class="mt-2 flex items-center hover:underline">
				<Mail class="mr-2 h-4 w-4" />
				{config.email}
			</a>
			<div class="mt-2 flex items-center">
				<Eye class="mr-2 h-4 w-4" />
				{#await views}
					<p>...</p>
				{:then views}
					{views}
				{/await}
			</div>
		</div>
		<div class="flex space-x-4">
			<Button
				variant="ghost"
				size="icon"
				href={config.socials_url.linkedin}
				target="_blank"
				rel="noopener noreferrer"><Linkedin /></Button
			>
			<Button
				variant="ghost"
				size="icon"
				href={config.socials_url.instagram}
				target="_blank"
				rel="noopener noreferrer"><Instagram /></Button
			>
			<Button
				variant="ghost"
				size="icon"
				href={config.socials_url.github}
				target="_blank"
				rel="noopener noreferrer"><Github /></Button
			>
			<Button
				variant="ghost"
				size="icon"
				href={config.socials_url.whatsapp}
				target="_blank"
				rel="noopener noreferrer"><MessageCircleMore /></Button
			>
		</div>
	</div>
</footer>
