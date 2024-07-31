<script lang="ts">
	import * as m from '$paraglide/messages';
	import {theme} from "../../stores"
	import FancyAnchorButton from '$lib/FancyAnchorButton.svelte';
	import Header from '$lib/Header.svelte';
	import { route } from '$lib/i18n-routing';
	import { languageTag } from '$paraglide/runtime';
	import Icon from '$lib/Icon.svelte';
	import LanguageSwitcher from '$lib/LanguageSwitcher.svelte';
	import DarkModeSwitcher from '$lib/DarkModeSwitcher.svelte';

	import db from '../db';

	let user = db.user;
	

	
</script>

<header class:light={$theme} class:dark={!$theme}>
	<div class="container">
		<Header />
		<nav>
			<div>
				<FancyAnchorButton href={route('/play', languageTag())}>
					<div class="a">
						<!-- <Icon size="1.2em" src="$lib/assets/game.svg" alt={m.play()} /> -->
						<div
							style:font-weight= "200"
						> {m.play()}</div>
					</div>
				</FancyAnchorButton>
			</div>
			{#if $user}
			<div>
				<FancyAnchorButton href={route('/create', languageTag())}>
					<div class="a">
						<!-- <Icon src="$lib/assets/paint.svg" alt={m.create()} size="1.2em" /> -->
						<div>{m.create()}</div>
					</div>
				</FancyAnchorButton>
			</div>
			{:else}
			<div>
				<FancyAnchorButton href={route('/login', languageTag())}>
					<div class="a">
						<!-- <Icon src="$lib/assets/paint.svg" alt={m.create()} size="1.2em" /> -->
						<div>Login</div>
					</div>
				</FancyAnchorButton>
			</div>
			{/if}
			
			
			
			
			<!-- <div>
				<FancyAnchorButton href={route('/library', languageTag())}>
					<div class="a">
						<Icon size="1.2em" src="$lib/assets/library.svg" alt={m.library()} />
						<div>{m.library()}</div>
					</div>
				</FancyAnchorButton>
			</div> -->
			<!-- <div>
				<FancyAnchorButton href={route('/posts', languageTag())}>
					<div class="a">
						<Icon size="1.2em" src="$lib/assets/newspaper.svg" alt={m.blog()} />
						<div>{m.blog()}</div>
					</div>
				</FancyAnchorButton>
			</div> -->
			
			<LanguageSwitcher />
			<DarkModeSwitcher />
		</nav>
	</div>
</header>

<style>
	.container{
		max-width: 80ch;
		width: 100%;
		display: flex;
		justify-content: space-between;
		margin: 0 auto;
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
	header {
		
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.3em 0.6em;
		


		@media (max-width: 600px) {
			flex-direction: column;
			align-items: stretch;
		}

		gap: 0.3em;
	}

	nav {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		gap: 0.3em;
		
	}

	nav > div {
		flex: 1;
	}

	.a {
		display: flex;
		font-family: "Montserrat", sans-serif;;
		white-space: nowrap;
		align-items: center;
		justify-content: center;
		gap: 0.2em;
		padding: 0.2em;
	}
</style>
