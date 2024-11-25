<script lang="ts">
	import Nav from './header/Nav.svelte';
	import { MediaQuery } from 'runed';
	import MobileNav from './header/MobileNav.svelte';
	const isDesktop = new MediaQuery('(min-width: 768px)');
</script>

<nav class="bg-primary p-4 text-primary-foreground">
	<div class="container mx-auto flex items-center justify-between">
		<div class="w-[150px]">
			<a href="/">
				<img src="/logo-white.svg" alt="An alt text" />
			</a>
		</div>

		{#if isDesktop.matches}
			<Nav />
		{:else}
			<MobileNav />
		{/if}
	</div>
</nav>
