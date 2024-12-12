<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	import * as m from '$lib/paraglide/messages.js';

	let { author = $bindable(), submit, loading = $bindable(), dataAuthors } = $props();

	const authors = dataAuthors.map((record) => {
		return {
			value: record.id,
			label: record.name
		};
	});

	const triggerContent = $derived(
		authors.find((f) => f.value === author)?.label ?? m.authors_select()
	);
</script>

<p class="text-sm font-medium">{m.author()}</p>
<Select.Root
	type="single"
	name="author"
	bind:value={author}
	onValueChange={submit}
	disabled={loading}
>
	<Select.Trigger class="w-[180px]">
		{triggerContent}
	</Select.Trigger>
	<Select.Content>
		<Select.Group>
			<Select.GroupHeading>{m.authors()}</Select.GroupHeading>
			{#each authors as author}
				<Select.Item value={author.value} label={author.label}>{author.label}</Select.Item>
			{/each}
		</Select.Group>
	</Select.Content>
</Select.Root>
