<script lang="ts">
	import * as m from '$paraglide/messages';

	import { limits } from '$lib';
	import Icon from '$lib/Icon.svelte';
	import SelectTime from '$lib/SelectTime.svelte';
	import type { Slide } from '$lib/types';

	export let activeSlide: Slide;
</script>

<div id="sidebar-container">
	<div id="sidebar">
		<div >
			<div class="field-title btn">{m.time_before_answers()}</div>
			<div class="btn">
				<SelectTime
					options={[...limits.fuiz.multipleChoice.allowedIntroduceQuestion]}
					map={(v) => (parseInt(v) / 1000).toString()}
					bind:selected={activeSlide.MultipleChoice.introduce_question}
				>
					<Icon src="$lib/assets/timer.svg" size="1em" alt={m.time_before_answers()} />
				</SelectTime>
			</div>
		</div>
		<div>
			<div class="field-title btn">{m.time_limit()}</div>
			<div class="btn">
				<SelectTime
					options={[...limits.fuiz.multipleChoice.allowedTimeLimits]}
					map={(v) => (parseInt(v) / 1000).toString()}
					bind:selected={activeSlide.MultipleChoice.time_limit}
				>
					<Icon src="$lib/assets/timer.svg" size="1em" alt={m.time_limit()} />
				</SelectTime>
			</div>
		</div>
		<div>
			<div class="field-title btn">{m.points()}</div>
			<div class="btn">
				<SelectTime
					options={[...limits.fuiz.multipleChoice.allowedPointsAwarded]}
					map={(v) => {
						if (v === '0') {
							return m.none();
						} else if (v === '500') {
							return m.half();
						} else if (v === '1000') {
							return m.regular();
						} else if (v === '2000') {
							return m.double();
						}
						return v;
					}}
					bind:selected={activeSlide.MultipleChoice.points_awarded}
				>
					<Icon src="$lib/assets/score.svg" size="1em" alt={m.points()} />
				</SelectTime>
			</div>
		</div>
	</div>
</div>

<style>
	#sidebar {
		width: 8em;
		padding-top: 10px;
		display: flex;
		flex-direction: column;
		border-inline-start: 0.05em solid #00000020;
		height: 100%;

		& > div {
			margin: 0.4em;
		}

		& .field-title {
			font-size: 0.6em;
			margin-bottom:10px
		}
	}

	.btn{
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
	}

	@media only screen and (max-width: 900px) {
		#sidebar {
			overflow: scroll;
			width: auto;
			flex-direction: row;
			border-block-end: 0.05em solid #00000020;
			border-inline-start: none;
		}

		#sidebar > div {
			min-width: max-content;
		}

		#sidebar-container {
			min-width: 100%;
			width: 0px;
		}
	}
</style>
