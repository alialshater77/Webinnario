<script lang="ts">
    import Footer from '$lib/Footer.svelte';
    import * as m from '$paraglide/messages';
    import { buttonColors, limits } from '$lib';
    import FancyButton from '$lib/FancyButton.svelte';
    import Textarea from '$lib/Textarea.svelte';

    import { onMount } from 'svelte';
    
    import {
        insertClass
	} from './api';
	import SelectMenu from './SelectMenu.svelte';

    let subjectName = '';
    let subjectCode = '';
	let selectedClassId = '';
	let isClassSelected = false;

    function handleSubmit(event) {
        console.log(selectedClassId)
        
        event.preventDefault()
        insertClass(subjectName, subjectCode , selectedClassId)
    }

	function handleSelectChange(event) {
        selectedClassId = event.detail.value;
		isClassSelected = !!selectedClassId;
        console.log('Selected class ID:', selectedClassId);
    }

</script>


<main>
	<section>
		<div class="split">
			<div>
				<h2>Add Subject</h2>
				
                <form class="input-container" on:submit={handleSubmit}>
					<SelectMenu
                        placeholder="Specialization"
                        id="question_title"
                        required={true}
                        disabled={false}
                        bind:value={selectedClassId}
                        on:change={handleSelectChange}
                        maxHeight="4em"
                    />

					{#if isClassSelected}
                    <Textarea
                        placeholder="Subject Name"
                        id="question_title"
                        bind:value={subjectName}
                        required={false}
                        disabled={false}
                        maxHeight="4em"
                    />

                    <Textarea
                        placeholder="Subject Code"
                        id="question_title"
                        bind:value={subjectCode}
                        required={false}
                        disabled={false}
                        maxHeight="4em"
                    />

                    <FancyButton
                        backgroundColor={buttonColors.at(buttonColors.length)?.[0]}
                        backgroundDeepColor={buttonColors.at(buttonColors.length)?.[1]}
                    >
                        <div
                            style:height="100%"
                            style:text-align="center"
                            style:display="flex"
                            style:align-items="center"
                            style:justify-content="center"
                            style:padding="0.2em 0.6em"
                            style:gap="0.2em"
                            style:box-sizing="border-box"
                        >
                            <div>Submit</div>
                        </div>
                    </FancyButton>
					{/if}
                </form>
			</div>
		</div>
	</section>
	
	<footer>
		<Footer />
	</footer>
</main>


<style>

	main {
		background-color: var(--background-color);
		line-height: 1.25;
		height: 100%;
		display: flex;
		justify-content: space-between;
		flex-direction: column;
	}

    .input-container{
        display: flex;
        flex-direction: column;
        margin-top: 3em;
        height: 100%;
        gap: 3rem;
        align-items: center;
    }

	section {
		& > div {
			max-width: 60ch;
			margin: auto;
			display: flex;
			justify-content: flex-start;
			align-items: center;
		}
		text-align: center;
		
		padding: 1em;
	}

	h2 {
		margin: 0 0 0.5em;
		font-size: 3rem !important;
		font-family: "Montserrat", sans-serif;;
	}

	p {
		margin: 0.5em 0;
	}

	.slide-container {
		border: 0.15em solid;
		border-radius: 0.9em;
		position: relative;
		overflow: hidden;
	}

	.slide {
		position: relative;
		font-size: min(1em, 3vw);
		aspect-ratio: 90 / 72;
		z-index: 1;
	}

	.split {
		& div:first-child {
			flex: 1;
		}
		flex-wrap: wrap-reverse;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1em;
	}
</style>