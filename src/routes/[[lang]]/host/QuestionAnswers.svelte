<script lang="ts">
	import AnsweredCount from '$lib/Game/AnsweredCount.svelte';
	import think from '$lib/assets/kevin_macleod_thinking_music.mp3';
	import Answers from '$lib/Game/Answers.svelte';
	import MediaContainer from '$lib/MediaContainer.svelte';
	import NiceBackground from '$lib/NiceBackground.svelte';
	import TimeLeft from '$lib/Game/TimeLeft.svelte';
	import VerticalTripleSplit from '$lib/Game/VerticalTripleSplit.svelte';
	import Topbar from './Topbar.svelte';
	import TextBar from '$lib/Game/TextBar.svelte';
	// import Audio from '$lib/Audio.svelte';
	import type { BindableGameInfo, SharedGameInfo } from './+page';
	import type { Media } from '$lib/types';

	export let bindableGameInfo: BindableGameInfo;
	export let gameInfo: SharedGameInfo;

	export let questionText: string;
	export let answers: (string | undefined)[];
	export let timeLeft: number | undefined;
	export let timeStarted: number | undefined;
	export let answeredCount: number;
	export let media: Media | undefined;

	let fullscreenElement;
</script>

<!-- <Audio audioUrl={think} volumeOn={bindableGameInfo.volumeOn} /> -->
<div
	bind:this={fullscreenElement}
	style:height="100%"
	style:display="flex"
	style:flex-direction="column"
>
	<Topbar bind:bindableGameInfo {gameInfo} on:lock on:next {fullscreenElement} showSkip={true} />
	<TextBar text={questionText} />
	<div style:flex="1">
		<NiceBackground>
			<VerticalTripleSplit>
				<svelte:fragment slot="top">
					<div
						style:display="flex"
						style:justify-content="space-between"
						style:z-index="1"
						style:padding="0.4em"
					>
						{#if timeLeft !== undefined && timeStarted !== undefined}
							<TimeLeft {timeLeft} {timeStarted} />
						{/if}
						<AnsweredCount {answeredCount} />
					</div>
				</svelte:fragment>
				<svelte:fragment slot="center">
					<MediaContainer {media} showFallback={false} />
				</svelte:fragment>
				<svelte:fragment slot="bottom">
					<Answers
						on:answer
						answers={answers.map((a) => {
							if (a === undefined) return { text: '?', correct: undefined };
							return { text: a, correct: undefined };
						})}
					/>
				</svelte:fragment>
			</VerticalTripleSplit>
		</NiceBackground>
	</div>
</div>
