<script lang="ts">
	import * as HoverCard from '$lib/components/ui/hover-card';
	import * as Avatar from '$lib/components/ui/avatar';
	import { getImageURL, getInitials } from '$lib/tools';

	import Mail from 'lucide-svelte/icons/mail';
	import Linkedin from 'lucide-svelte/icons/linkedin';
	import Instagram from 'lucide-svelte/icons/instagram';
	import Github from 'lucide-svelte/icons/github';

	let { member } = $props();

	let open = $state(false);
</script>

<HoverCard.Root {open}>
	<HoverCard.Trigger>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="flex flex-row items-center" onclick={() => (open = !open)}>
			<Avatar.Root class="mr-3">
				<Avatar.Image src={getImageURL('members', member.id, member.avatar)} alt={member.name} />
				<Avatar.Fallback>{getInitials(member.name)}</Avatar.Fallback>
			</Avatar.Root>

			<div>
				<p class="font-semibold">{member.name}</p>
				<p class="text-sm text-muted-foreground">{member.description}</p>
			</div>
		</div>
	</HoverCard.Trigger>
	<HoverCard.Content>
		<div class="flex space-x-4">
			<Avatar.Root>
				<Avatar.Image src={getImageURL('members', member.id, member.avatar)} alt={member.name} />
				<Avatar.Fallback>{getInitials(member.name)}</Avatar.Fallback>
			</Avatar.Root>
			<div class="space-y-0">
				<h4 class="text-md font-semibold">{member.name}</h4>
				<p class="text-sm text-muted-foreground">{member.role}</p>
				<div class="flex items-center pt-2">
					{#if member.instagram}
						<a href={member.instagram}>
							<Instagram class="mr-2 size-4 opacity-70" />
						</a>
					{/if}
					{#if member.github}
						<a href={member.github}>
							<Github class="mr-2 size-4 opacity-70" />
						</a>{/if}
					{#if member.linkedin}
						<a href={member.linkedin}>
							<Linkedin class="mr-2 size-4 opacity-70" />
						</a>{/if}
					{#if member.email}
						<a href="mailto:{member.email}">
							<Mail class="mr-2 size-4 opacity-70" />
						</a>{/if}
				</div>
			</div>
		</div>
	</HoverCard.Content>
</HoverCard.Root>
