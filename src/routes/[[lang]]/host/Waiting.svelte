<script lang="ts">
	import * as m from '$paraglide/messages';
	import { PUBLIC_DISPLAY_PLAY_URL, PUBLIC_PLAY_URL } from '$env/static/public';
	import FancyButton from '$lib/FancyButton.svelte';
	import Fullscreen from '$lib/Fullscreen.svelte';
	import bee3 from '$lib/assets/bee3.mp3';
	import NiceBackground from '$lib/NiceBackground.svelte';
	// import Audio from '$lib/Audio.svelte';
	import PlayersList from '$lib/Game/PlayersList.svelte';
	import volume_up from '$lib/assets/volume_up.svg';
	import volume_off from '$lib/assets/volume_off.svg';
	import unlocked from '$lib/assets/unlocked.svg';
	import locked from '$lib/assets/locked.svg';
	import QrCode from '$lib/Game/QRCode.svelte';
	import { createEventDispatcher, onMount } from 'svelte';
	import type { BindableGameInfo } from './+page';
	import StatedIconButton from '$lib/StatedIconButton.svelte';
	import { languageTag } from '$paraglide/runtime';
	import { route } from '$lib/i18n-routing';
	import Icon from '$lib/Icon.svelte';
	import ExitFuiz from './ExitFuiz.svelte';
	import tippy from 'tippy.js';

	export let code: string;
	export let players: string[];
	export let exact_count: number;

	export let bindableGameInfo: BindableGameInfo;

	$: actualUrl = PUBLIC_PLAY_URL + route('/play?code=' + code, languageTag());

	const dispatch = createEventDispatcher<{
		next: undefined;
		lock: boolean;
	}>();

	function copy_url_to_clipboard() {
		navigator.clipboard.writeText(actualUrl);
	}

	let fullscreenElement;

	let copyUrlButton: HTMLButtonElement;

	onMount(() => {
		tippy(copyUrlButton, {
			content: m.copy_clipboard(),
			arrow: false,
			theme: 'fuiz'
		});
		tippy(copyUrlButton, {
			trigger: 'click',
			content: m.copied(),
			arrow: false,
			theme: 'fuiz'
		});
	});
</script>

<!-- <Audio audioUrl={bee3} volumeOn={bindableGameInfo.volumeOn} /> -->
<div id="container" bind:this={fullscreenElement} style:height="100%" style:display="flex">
	<div
		id="info"
		style:background="var(--background-color)"
		style:box-shadow="0 2px 2px #00000040, 2px 0 2px #00000040"
		style:display="flex"
		style:align-items="start"
		style:gap="1em"
		style:padding="0.6em 0.4em"
		style:justify-content="space-between"
	>
		<div>
			<ExitFuiz />
			<div style:padding="0.4em">
				<div>{m.join_at()}</div>
				<div style:font-weight="bold">
					{PUBLIC_DISPLAY_PLAY_URL}{route('/play', languageTag())}
				</div>
			</div>
		</div>
		<div
			style:background="color-mix(in srgb, currentColor 20%, transparent)"
			style:display="flex"
			style:align-items="center"
			style:padding="0.4em"
			style:gap="0.4em"
			style:border-radius="0.4em"
		>
			<button
				on:click={copy_url_to_clipboard}
				bind:this={copyUrlButton}
				style:font="inherit"
				style:color="inherit"
				style:appearance="none"
				style:border="none"
				style:background="none"
				style:cursor="pointer"
				style:text-align="start"
				style:font-family="Poppins"
			>
				<div style:font-size="1em">{m.game_code()}</div>
				<div style:font-size="3em" style:line-height="1em" style:text-transform="uppercase">
					{code}
				</div>
			</button>
			<QrCode url={actualUrl} smallSize="9em" />
		</div>
		<div
			style:display="flex"
			style:justify-content="center"
			style:width="fit-content"
			style:font-size="1.5em"
		>
			<FancyButton on:click={() => dispatch('next')}>
				<div >{m.start()}</div>
			</FancyButton>
		</div>
	</div>
	<div style:flex="1">
		<NiceBackground>
			<div
				style:height="100%"
				style:display="flex"
				style:flex-direction="column"
				style:gap="0.2em"
				style:padding="0.2em"
				style:box-sizing="border-box"
			>
				<div style:display="flex" style:gap="0.2em" style:align-items="center">
					<div style:flex="1" style:display="flex" style:align-items="center">
						<Icon src="$lib/assets/person.svg" size="1em" alt={m.number_of_players()} />
						{exact_count}
					</div>
					<StatedIconButton
						data_set = "waiting"
						icons={[
							{ src: unlocked, alt: m.lock_game() },
							{ src: locked, alt: m.unlock_game() }
						]}
						size="1em"
						bind:state={bindableGameInfo.locked}
						on:change={(e) => {
							dispatch('lock', e.detail);
						}}
					/>
					<StatedIconButton
					data_set = "waiting"
						icons={[
							{ src: volume_off, alt: m.turn_on_music() },
							{ src: volume_up, alt: m.mute_music() }
						]}
						size="1em"
						bind:state={bindableGameInfo.volumeOn}
					/>
					<!-- <Fullscreen {fullscreenElement} /> -->
				</div>
				<div
					style:min-height="40vh"
					style:margin="auto"
					style:display="flex"
					style:align-items="center"
					style:justify-content="center"
				>
					<div
						id="players"
						style:display="flex"
						style:justify-content="center"
						style:align-items="center"
						style:flex-wrap="wrap"
						style:max-width="40ch"
						style:gap="0.2em"
						style:padding="0.2em"
						style:overflow="auto"
					>
						<PlayersList players={players.map((n) => [n, false])} exactCount={exact_count} />
					</div>
				</div>
			</div>
		</NiceBackground>
	</div>
</div>

<style>
	#players {
		font-size: 1.5em;
	}

	#container {
		flex-direction: column;
	}

	#info {
		flex-wrap: wrap;
	}

	@media (max-width: 700px) {
		#players {
			font-size: 0.8em;
		}

		#info {
			flex-direction: column;
		}
	}
</style>
