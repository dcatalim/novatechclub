<script lang="ts">
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';

	let { selectValue = $bindable(), fetchResults, loading = $bindable(), dataAuthors } = $props();

	const authors = dataAuthors.map((record) => {
		return {
			value: record.id,
			label: record.name
		};
	});

	const triggerContent = $derived(
		authors.find((f) => f.value === selectValue)?.label ?? 'Select an author'
	);
</script>

<Label for="author">Author</Label>
<Select.Root
	type="single"
	name="author"
	bind:value={selectValue}
	onValueChange={fetchResults}
	disabled={loading}
>
	<Select.Trigger class="w-[180px]">
		{triggerContent}
	</Select.Trigger>
	<Select.Content>
		<Select.Group>
			<Select.GroupHeading>Authors</Select.GroupHeading>
			{#each authors as author}
				<Select.Item value={author.value} label={author.label}>{author.label}</Select.Item>
			{/each}
		</Select.Group>
	</Select.Content>
</Select.Root>
