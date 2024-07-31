<script lang="ts">
	import * as m from '$paraglide/messages';

	import { limits } from '$lib';
	import Textarea from '$lib/Textarea.svelte';
	import Answers from './Answers.svelte';
	import MediaChooser from './MediaChooser.svelte';
	import type { MultipleChoiceSlide } from '$lib/types';
	import SelectMenu from './SelectMenu.svelte';
	import SubjectSelectMenu from './SubjectSelectMenu.svelte';

	export let slide: MultipleChoiceSlide;

	let selectedClassId = '';

	if (slide.time_limit < 1000) slide.time_limit *= 1000;
	if (slide.introduce_question < 1000) slide.introduce_question *= 1000;

	function handleSelectChange(event) {
        slide.title = event.detail.value;
        console.log('Selected Question:', slide.title);
    }
	function handleSubjectSelectChange(event) {
        selectedClassId = event.detail.value;
        console.log('Selected class:', selectedClassId);
    }
</script>

<div
	style:flex="1"
	style:display="flex"
	style:flex-direction="column"
	style:gap="0.2em"
	style:padding="0.6em 0.4em 0.4em"
	style:align-items="center"
	style:justify-content="space-between"
>
	<div style:max-width="25ch" style:width="100%" style:padding-top="0.5em" >

			<SubjectSelectMenu
				placeholder="Choose Subject"
				id="question_title"
				required={false}
				disabled={false}
				bind:value={selectedClassId}
				on:change={handleSubjectSelectChange}
				maxHeight="4em"
			/>

			
			
	</div>
	<div style:margin-top="10px" style:width="75%">
		<SelectMenu
		placeholder="Choose Question"
		id="question_title"
		required={false}
		disabled={false}
		selectedClassId={selectedClassId}
		bind:value={slide.title}
		on:change={handleSelectChange}
		maxHeight="4em"
	/>
	</div>
	<div
		style:display="flex"
		style:width="100%"
		style:flex-wrap="wrap-reverse"
		style:gap="0.2em"
		style:align-items="center"
		style:justify-content="center"
	>
		<MediaChooser bind:media={slide.media} />
	</div>
	<Answers bind:answers={slide.answers} />
</div>
