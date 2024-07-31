<script lang="ts">
	// import Anchor from "./Anchor.svelte";
	import {theme} from "../stores"
	export let foregroundColor: string;
	export let backgroundColor: string;
	export let backgroundDeepColor: string;

	export let href: string;
</script>

<a
	{href}
	style:display="flex"
	style:background="none"
	style:border="none"
	style:text-decoration="none"
	style:box-sizing="border-box"
	style:padding="0.2em 0 0 0"
	style:width="100%"
	style:height="100%"
	style:font="inherit"
	style:outline="none"
>
	<div
	style:background={backgroundDeepColor}
		style:border-radius="2px"
		style:transform="translateY(0)"
		style:width="100%"
		style:height="100%"
		
	>
		<div
			class="front"
			class:light={$theme} 
			class:dark={!$theme}
			style:font-size="1.2rem"
			style:border="0.15em solid {backgroundDeepColor}"
			style:border-radius="4px"
			style:padding="0.2em 0.9em"
			style:box-sizing="border-box"
			style:color={foregroundColor}
			style:width="100%"
			style:height="100%"
		>
			<slot />
		</div>
	</div>
</a>

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
	a .front {
		transform: translateY(-0.15em);
		transition: transform 150ms;
	}

	a:active:not(:disabled) .front {
		transform: translateY(0em);
	}

	a:where(:hover, :focus) .front {
		transform: translateY(-0.3em);
	}
</style>
