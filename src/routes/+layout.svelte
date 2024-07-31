<script lang="ts">
	import '@fontsource/poppins/800.css';
	import '@fontsource/atkinson-hyperlegible';
	import 'tippy.js/dist/tippy.css';

	import { navigating, page } from '$app/stores';
	import { setLanguageTag, sourceLanguageTag, type AvailableLanguageTag } from '$paraglide/runtime';
	import { browser } from '$app/environment';
	import I18NHeader from '$lib/I18NHeader.svelte';
	import { onMount } from 'svelte';
	import Loading from '$lib/Loading.svelte';

	function getLang(param: AvailableLanguageTag): AvailableLanguageTag {
		return param ?? sourceLanguageTag;
	}

	let lang: AvailableLanguageTag = sourceLanguageTag;

	$: browser && ((l) => (lang = l))(getLang($page.params.lang as AvailableLanguageTag));

	//Use the default language if no language is given
	$: setLanguageTag(lang);

	onMount(() => {
		function getTheme() {
			if (window.matchMedia && window.matchMedia('(prefers-color-scheme:dark)').matches) {
				return 'dark';
			} else {
				return 'light';
			}
		}

		function getOrSet(): string {
			const local = localStorage.getItem('theme');
			if (local) return local;

			const def = getTheme();
			localStorage.setItem('theme', def);
			return def;
		}

		document.documentElement.setAttribute('data-theme', getOrSet());

		mounting = false;
	});

	//Set the lang attribute on the html tag
	$: if (browser) document.documentElement.lang = lang;

	let mounting = true;

	const startTimer = (f: () => void, ms: number) => {
		let timer = setTimeout(f, ms);
		return () => {
			clearTimeout(timer);
		};
	};

	let longNavigating = false;
	let stopTimer: () => void = () => {
		// left empty for a reason
	};

	$: {
		if ($navigating) {
			stopTimer = startTimer(() => {
				longNavigating = true;
			}, 100);
		} else {
			stopTimer();
			longNavigating = false;
		}
	}
</script>

<I18NHeader />

{#key lang}
	{#if mounting || longNavigating}
		<Loading />
	{:else}
		<slot />
	{/if}
{/key}

<style>
	:root {
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

		@media (prefers-color-scheme: dark) {
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
		}
	}

	:global(html[data-theme='light']) {
		--background: #FFFFFF;
		--color: #020817;
	}

	:global(html[data-theme='dark']) {
		--background: #020817;
		--color: #FFFFFF;
	}

	:global(body) {
		font-family: 'Atkinson Hyperlegible', sans-serif;
		font-size: 24px;
		color: var(--color);
		min-height: 100%;
		display: flex;
		flex-direction: column;
		font-family: "Raleway", sans-serif;
	}

	:global(html) {
		background: var(--background);
		height: 100%;
		font-family: "Raleway", sans-serif;
	}

	:global(.tippy-box[data-theme~='fuiz']) {
		background-color: var(--background);
		border: 3px solid;
		border-radius: 0.7em;
		padding: 0em 0.4em;
		font-size: inherit;
		color: inherit;
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
		background-color: var(--destructive);
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
		background-color: var(--primary);
	}
</style>
