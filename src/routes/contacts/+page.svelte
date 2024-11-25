<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { config } from '$lib/config';
	import { PUBLIC_WEB3FORMS_KEY } from '$env/static/public';
	
	import Mail from 'lucide-svelte/icons/mail';
	import Linkedin from 'lucide-svelte/icons/linkedin';
	import Instagram from 'lucide-svelte/icons/instagram';
	import Github from 'lucide-svelte/icons/github';
	import MessageCircleMore from 'lucide-svelte/icons/message-circle-more';

	let status = $state('');
	let name = $state('');
	let email = $state('');
	let subject = $state('');
	let message = $state('');

	const handleSubmit = async (data) => {
		status = 'Submitting...';
		const formData = new FormData(data.currentTarget);
		const object = Object.fromEntries(formData);
		const json = JSON.stringify(object);

		const response = await fetch('https://api.web3forms.com/submit', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			},
			body: json
		});
		const result = await response.json();
		if (result.success) {
			console.log(result);
			status = result.message || 'Success';
		}
	};

	function once(fn) {
		return function (event) {
			if (fn) fn.call(this, event);
			fn = null;
		};
	}

	function preventDefault(fn) {
		return function (event) {
			event.preventDefault();
			fn.call(this, event);
		};
	}
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-8 text-center text-4xl font-bold">{m.contacts_title()}</h1>

	<div class="flex flex-col gap-8 md:flex-row">
		<Card.Root class="flex-1">
			<Card.Header>
				<Card.Title>{m.contacts_form_title()}</Card.Title>
			</Card.Header>
			<Card.Content>
				<form onsubmit={once(preventDefault(handleSubmit))} class="space-y-4">
					<input type="hidden" name="access_key" value={PUBLIC_WEB3FORMS_KEY} />
					<input type="checkbox" name="botcheck" class="hidden" style="display: none;" />
					<div>
						<Input
							type="text"
							name="name"
							placeholder={m.contacts_form_name_placeholder()}
							bind:value={name}
							required
						/>
					</div>
					<div>
						<Input
							type="email"
							name="email"
							placeholder={m.contacts_form_email_placeholder()}
							bind:value={email}
							required
						/>
					</div>
					<div>
						<Input
							type="text"
							name="subject"
							placeholder={m.contacts_form_subject_placeholder()}
							bind:value={subject}
							required
						/>
					</div>
					<div>
						<Textarea
							name="message"
							placeholder={m.contacts_form_message_placeholder()}
							bind:value={message}
							required
						/>
					</div>
					<Button type="submit" class="w-full">{m.contacts_form_button()}</Button>
				</form>
				<div class="m-4">
					{status}
				</div>
			</Card.Content>
		</Card.Root>

		<Card.Root class="flex-1">
			<Card.Header>
				<Card.Title>{m.contacts_info_title()}</Card.Title>
			</Card.Header>
			<Card.Content class="space-y-4">
				<div>
					<h3 class="mb-2 font-semibold">Email</h3>
					<a href="mailto:{config.email}" class="mt-2 flex items-center hover:underline">
						<Mail class="mr-2 h-4 w-4" />
						{config.email}
					</a>
				</div>
				<Separator />
				<div>
					<h3 class="mb-2 font-semibold">{m.contacts_social_media()}</h3>
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
				<Separator />
				<div>
					<h3 class="mb-2 font-semibold">{m.contacts_address()}</h3>
					<p>Nova - School of Business and Economics</p>
					<p>2775-405 Carcavelos</p>
					<p>Portugal</p>
				</div>
			</Card.Content>
		</Card.Root>
	</div>
</div>
