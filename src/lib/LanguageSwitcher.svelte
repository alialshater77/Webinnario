<script lang="ts">
	import * as m from '$paraglide/messages';

	import { availableLanguageTags } from '$paraglide/runtime';
	import { page } from '$app/stores';
	import { route } from '$lib/i18n-routing';
	import IconButton from './IconButton.svelte';
	import { createDialog } from 'svelte-headlessui';

	const dialog = createDialog();

	export let up = false;
</script>

<div>
	<IconButton
		on:click={() => {
			dialog.open();
		}}
		src="$lib/assets/language.svg"
		alt={m.language()}
		size="1em"
	/>

	{#if $dialog.expanded}
		<ul use:dialog.modal style:--y={up ? 'calc(-100% - 1.25em)' : '0'}>
			{#each availableLanguageTags as lang}
				<li>
					<a href={route($page.url.pathname + $page.url.search, lang)} hreflang={lang}
						>{new Intl.DisplayNames([lang], {
							type: 'language'
						}).of(lang)}</a
					>
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style>
	div {
		position: relative;
	}

	.dark{
		--background: #020817;
			--color: #FFFFFF;

			--foreground: #f8fafc;
			--card: #020817;
			--card-foreground: #f8fafc;
			--popover: #020817;
			--popover-foreground: #f8fafc;
			--primary: #3b82f6;
			--primary-foreground: #0f192a;
			--secondary: #1e293b;
			--secondary-foreground: #f8fafc;
			--muted: #1e293b;
			--muted-foreground: #94a3b8;
			--accent: #1e293b;
			--accent-foreground: #f8fafc;
			--destructive: #7f1d1d;
			--destructive-foreground: #f8fafc;
			--border: #1e293b;
			--input: #1e293b;
			--ring: #1d4ed8;
		border-bottom: 1px solid var(--border);
	}	

	.light{
		--background: #FFFFFF;
		--color: #020817;
		--palette-light: #FFFFFF;
		--palette-dark: #020817;
		--accent-color: #2563eb;
		--foreground: #020817;
		--card: #ffffff;
		--card-foreground: #020817;
		--popover: #ffffff;
		--popover-foreground: #020817;
		--primary: #2563eb;
		--primary-foreground: #f8fafc;
		--secondary: #f1f5f9;
		--secondary-foreground: #0f172a;
		--muted: #f1f5f9;
		--muted-foreground: #64748b;
		--accent: #f1f5f9;
		--accent-foreground: #0f172a;
		--destructive: #dc2626;
		--destructive-foreground: #f8fafc;
		--border: #e2e8f0;
		--input: #e2e8f0;
		--ring: #2563eb;
		--radius: 0.5rem;
		border-bottom: 1px solid var(--border);
	}

	ul {
		position: absolute;
		background: var(--background);
		border: 0.1em solid;
		border-radius: 0.4em;
		transform-origin: top;
		padding: 0.3em;
		transform: translateX(calc(-100% + 1.25em)) translateY(var(--y));

		z-index: 100;
		margin: 0.15em 0;
	}

	ul:dir(rtl) {
		transform: translateX(calc(100% - 1.25em)) translateY(var(--y));
	}

	li {
		display: block;
		text-transform: capitalize;
		padding: 0.3em 0.3em;
		line-height: 1.25;
		white-space: nowrap;
	}

	a {
		color: inherit;
		text-decoration: none;
	}
</style>
