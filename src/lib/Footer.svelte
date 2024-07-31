<script lang="ts">
	import * as m from '$paraglide/messages';

	import DarkModeSwitcher from '$lib/DarkModeSwitcher.svelte';
	import {theme} from "../stores"
	import diversity from '$lib/assets/diversity.svg';
	import balance from '$lib/assets/balance.svg';
	import Icon from './Icon.svelte';
	import Anchor from './Anchor.svelte';
	import LanguageSwitcher from './LanguageSwitcher.svelte';
	import { route } from './i18n-routing';
	import { languageTag } from '$paraglide/runtime';
</script>

<div
	class:light={$theme}
	class:dark={!$theme}
	style:text-align="center"
	style:width="100%"
	style:font-size="0.75em"
	style:box-sizing="border-box"
	style:font-family="Poppins"
	style:padding="8px"
	style:display="flex"
	style:align-items="center"
	style:gap="10px"
	style:justify-content="center"
	style:flex-wrap="wrap"
	style:margin-top= "auto"
	
>
	
	<LanguageSwitcher up={true} />
	<DarkModeSwitcher />
</div>


<style>
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
		border-top: 1px solid var(--border);
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
		border-top: 1px solid var(--border);
	}
</style>
