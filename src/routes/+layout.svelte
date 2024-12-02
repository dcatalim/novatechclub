<script lang="ts">
	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';

	import Header from '$lib/ui/Header.svelte';

	import '../app.css';
	import Footer from '$lib/ui/Footer.svelte';
	import { page } from '$app/stores';
	import { config } from '$lib/config';

	let { data, children } = $props();
	
</script>

<svelte:head>
	<title>{$page.data.title}</title>
	<meta name="description" content={config.description} />
	<meta name="keywords" content={config.keywords} />

	<meta property="og:url" content="https://{config.domain}{$page.url.pathname.toString()}" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={$page.data.title} />
	<meta property="og:description" content={config.description} />
	<meta property="og:image" content={config.logo_path} />
	<meta property="og:locale" content="en_US" />
	<meta property="og:locale:alternate" content="pt_PT" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta property="twitter:domain" content={config.domain} />
	<meta property="twitter:url" content="https://{config.domain}{$page.url.pathname.toString()}" />
	<meta name="twitter:title" content={$page.data.title} />
	<meta name="twitter:description" content={config.description} />
	<meta name="twitter:image" content={config.logo_path} />

	{@html `  <script type="application/ld+json">{
   "@context": "https://schema.org",
   "@type": "Website",
   "name": "${$page.data.title} | ${config.title},
   "url": "https//${config.domain}${$page.url.pathname}",
   "logo": ${config.logo_path}  }</script>`}
</svelte:head>

<ParaglideJS {i18n}>
	<div class="flex min-h-screen flex-col">
		<Header />

		{@render children()}

		<Footer views={data.views} />
	</div>
</ParaglideJS>
