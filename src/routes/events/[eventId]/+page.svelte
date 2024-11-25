<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { formatDate, getImageURL, getInitials } from '$lib/tools';

	import { Button } from '$lib/components/ui/button';
	import * as Card from "$lib/components/ui/card/index.js";
	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';
	import * as Avatar from '$lib/components/ui/avatar';

	import Calendar from 'lucide-svelte/icons/calendar';
	import Clock from 'lucide-svelte/icons/clock';
	import Users from 'lucide-svelte/icons/users';
	import MapPin from 'lucide-svelte/icons/map-pin';

	let { data } = $props();

</script>

<svelte:head>
	<title>{data.event.title}</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<div class="mx-auto max-w-4xl">
		<header class="mb-8">
			<h1 class="mb-4 text-4xl font-bold">{data.event.title}</h1>
			<div class="mb-4 flex flex-wrap gap-4">
				<div class="flex items-center">
					<Calendar class="mr-2 h-5 w-5" />
					<span>{formatDate(data.event.date)}</span>
				</div>
				<div class="flex items-center">
					<Clock class="mr-2 h-5 w-5" />
					<span>{data.event.time}</span>
				</div>
				<div class="flex items-center">
					<MapPin class="mr-2 h-5 w-5" />
					<span>{data.event.location}</span>
				</div>
			</div>
			{#if data.event.tags}
			<div class="mb-4 flex flex-wrap gap-2">
				{#each data.event.tags.split(';') as tag}
					<Badge variant="secondary">{tag}</Badge>
				{/each}
			</div>
			{/if}
		</header>

		<div class="mb-8">
			<h2 class="mb-4 text-2xl font-semibold">{m.event_about()}</h2>
			<p class="text-gray-700">{data.event.description}</p>
		</div>

		<div class="mb-8">
			<h2 class="mb-4 text-2xl font-semibold">{m.event_speakers()}</h2>
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				{#each data.event?.expand?.speakers as speaker}
					<Card.Root>
						<Card.Content class="flex items-center p-4">
							<Avatar.Root class="mr-4 h-12 w-12">
								<Avatar.Image
									src={getImageURL('speakers', speaker.id, speaker.avatar)}
									alt={speaker.name }
								/>
								<Avatar.Fallback>{getInitials(speaker.name)}</Avatar.Fallback>
							</Avatar.Root>
							<div>
								<h3 class="font-semibold">{speaker.name}</h3>
								<p class="text-sm text-muted-foreground">{speaker.role}</p>
							</div>
						</Card.Content>
					</Card.Root>
				{/each}
			</div>
		</div>

		<div class="mb-8">
			<h2 class="mb-4 text-2xl font-semibold">{m.event_details()}</h2>
			<Card.Root>
				<Card.Content class="p-6">
					<div class="mb-4 flex items-center justify-between">
						<div class="flex items-center">
							<Users class="mr-2 h-5 w-5" />
							<span class="font-semibold">{m.event_capacity()}:</span>
						</div>
						<span>{data.event.capacity} {m.event_attendees()}</span>
					</div>
					<!-- <div class="flex justify-between items-center">
						<div class="flex items-center">
							<User class="mr-2 h-5 w-5" />
							<span class="font-semibold">Registered:</span>
						</div>
						<span>{event.registeredAttendees} attendees</span>
					</div> -->
					<Separator class="my-4" />
					<div class="text-center">
						<!-- <p class="mb-2">Spots remaining: {event.capacity - event.registeredAttendees}</p> -->
						<Button size="lg" href={data.event.link} target='_blank'>{m.event_button()}</Button>
					</div>
				</Card.Content>
			</Card.Root>
		</div>

		<Separator class="my-8" />

		<footer>
			<div class="flex items-center justify-between">
				<Button variant="outline" href="/events">{m.event_back()}</Button>
			</div>
		</footer>
	</div>
</div>
