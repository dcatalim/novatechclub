<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import * as Pagination from '$lib/components/ui/pagination/index.js';
	import { MediaQuery } from "svelte/reactivity";

	import ChevronLeft from 'lucide-svelte/icons/chevron-left';
	import ChevronRight from 'lucide-svelte/icons/chevron-right';

	let {
		page = $bindable(),
		count = $bindable(),
		perPage,
		loading = $bindable(),
		submit
	} = $props();

	const isDesktop = new MediaQuery('(min-width: 768px)');

	const siblingCount = $derived(isDesktop.matches ? 1 : 0);
</script>

<Pagination.Root bind:page {count} {perPage} {siblingCount} onPageChange={submit}>
	{#snippet children({ pages, currentPage })}
		<Pagination.Content>
			<Pagination.Item>
				<Pagination.PrevButton disabled={loading}>
					<ChevronLeft class="size-4" />
					<span class="hidden sm:block">{m.previous()}</span>
				</Pagination.PrevButton>
			</Pagination.Item>
			{#each pages as page (page.key)}
				{#if page.type === 'ellipsis'}
					<Pagination.Item>
						<Pagination.Ellipsis />
					</Pagination.Item>
				{:else}
					<Pagination.Item>
						<Pagination.Link {page} isActive={currentPage === page.value} disabled={loading}>
							{page.value}
						</Pagination.Link>
					</Pagination.Item>
				{/if}
			{/each}
			<Pagination.Item>
				<Pagination.NextButton disabled={loading}>
					<span class="hidden sm:block">{m.next()}</span>
					<ChevronRight class="size-4" />
				</Pagination.NextButton>
			</Pagination.Item>
		</Pagination.Content>
	{/snippet}
</Pagination.Root>
