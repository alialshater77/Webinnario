<script lang="ts">
	import type { Action } from 'svelte/action';
	import {theme} from "../stores"
	export let foregroundColor: string;
	export let backgroundColor: string;
	export let backgroundDeepColor: string;
	export let disabled = false;
	export let active = true;
	export let type: 'button' | 'submit' | 'reset' | undefined = undefined;
	export let action: Action;
</script>

<button
	use:action
	on:select
	{type}
	style:display="flex"
	style:background="none"
	style:border="none"
	style:color="inherit"
	style:box-sizing="border-box"
	style:padding="0.1em 0 0 0"
	
	style:cursor="pointer"
	style:height="100%"
	style:font="inherit"
	
	style:outline="none"
	disabled={disabled || !active}
	on:click
>
	<div

		style:transition="background 300ms linear"
		style:border-radius="0.7em"
		style:transform="translateY(0)"
		style:min-width="120px"
		style:height="100%"
	>
		<div
			class="front"
			class:light={$theme}
			class:dark={!$theme}

			style:font-size="22px"
			style:border-radius="8px"
			style:font-family="Raleway"
			style:box-sizing="border-box"
			style:color={foregroundColor}

			style:height="100%"
			style:padding="0.2em 0.2em"
		>
			<slot />
		</div>
	</div>
</button>

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
		background-color: var(--primary);
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

	button .front {
		transform: translateY(-0.15em);
		transition: transform 150ms, background-color 300ms linear, border-color 300ms linear;
	}

	button:active:not(:disabled) .front {
		transform: translateY(0em);
	}

	button:where(:hover, :focus) .front {
		transform: translateY(-0.3em);
	}
</style>
