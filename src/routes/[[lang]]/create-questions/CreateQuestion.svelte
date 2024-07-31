<script lang="ts">
    import Footer from '$lib/Footer.svelte';
    import * as m from '$paraglide/messages';
    import { buttonColors, limits } from '$lib';
    import FancyButton from '$lib/FancyButton.svelte';
    import Textarea from '$lib/Textarea.svelte';
    import SelectMenu from './SelectMenu.svelte';
    import Answer from './Answer.svelte';

    import { onMount } from 'svelte';
    
    import {
        insertQuestion
	} from './api';
	import SelectSpecializationMenu from './SelectSpecializationMenu.svelte';

    let selectedClassId = '';
    let selectedSpecialization = '';
    let questionTitle = '';
    let isSpecializationSelected = false;
    let isSubjectSelected = false;

    function handleSelectChange(event) {
        selectedClassId = event.detail.value;
        isSubjectSelected = !!selectedClassId
        console.log('Selected class ID:', selectedClassId);
    }

    function handleSelectSpecializationChange(event) {
        selectedSpecialization = event.detail.value;
        isSpecializationSelected = !!selectedSpecialization;
        console.log('Selected Sp ID:', selectedSpecialization);
    }

    function handleSubmit(event) {
        event.preventDefault();

        const isAnyCorrect = answers.some(answer => answer.correct);
        
        console.log('Form submitted with class ID:', selectedClassId);
        console.log('Form submitted with question name:', questionTitle);

        if (!isAnyCorrect) {
			alert('At least one answer must be marked as correct.');
			return;
		}else{
            const question = {
                title: questionTitle,
                answers: answers
            };

            insertQuestion(selectedClassId, selectedSpecialization, question)
            .then(() => {
                console.log('Question inserted successfully.');
            })
            .catch(error => {
                console.error('Error inserting question:', error);
            });

		    console.log('Form submitted with answers:', answers);
        }
    }

    let answers = [];
    let attention = false

	function addAnswer() {
		if (answers.length < 4) {
			answers = [...answers, { correct: false, content: { Text: '' }, attention: false }];  
		}
	}

	function deleteAnswer(event) {
		const index = event.detail.index;
		answers = answers.filter((_, i) => i !== index);
	}

</script>


<main>
	<section>
		<div class="split">
			<div>
				<h2>Add Question</h2>
				
                <form class="input-container" on:submit={handleSubmit}>

                    <SelectSpecializationMenu
                        placeholder="Specialization"
                        id="question_title"
                        required={true}
                        disabled={false}
                        bind:value={selectedSpecialization}
                        on:change={handleSelectSpecializationChange}
                        maxHeight="4em"
                    />
                    {#if isSpecializationSelected}
                    <SelectMenu
                        placeholder="Choose Subject"
                        id="question_title"
                        required={true}
                        disabled={false}
                        bind:value={selectedClassId}
                        on:change={handleSelectChange}
                        maxHeight="4em"
                    />

                    {#if isSubjectSelected}
                    <Textarea
                        placeholder="Question Title"
                        id="question_title"
                        bind:value={questionTitle}
                        required={true}
                        disabled={false}
                        maxHeight="4em"
                        
                    />

                    <div class="answer">
                        <div class="answers-container">
                        {#each answers as answer, index (index)}
                           <div class="each-answer">
                                <Answer
                                {index}
                                bind:correct={answer.correct}
                                bind:content={answer.content}
                                {attention}
                                on:delete={deleteAnswer}
                                />
                            </div>
                        {/each}
                        </div>

                        {#if answers.length < 4}
                            <FancyButton
                                on:click={addAnswer}
                                type="button"
                                backgroundColor={buttonColors.at(buttonColors.length)?.[0]}
                                backgroundDeepColor={buttonColors.at(buttonColors.length)?.[1]}
                            >
                                <div style:padding="0.2em 0.6em">Add Answer</div>
                            </FancyButton>
                        {/if}
                    </div>

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
		background-color: var(--background);
		line-height: 1.25;
		height: 100%;
		display: flex;
		justify-content: space-between;
		flex-direction: column;
	}

    .each-answer{
        width: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .answers-container{
        display: flex;
        width: 100%;
        flex-wrap: wrap;
        row-gap: 1.5rem;
        align-items: center;
    }

    .answer{
        display: flex;
        width: 100%;
        flex-direction: column;
        gap: 2rem;
        align-items: center;
    }


    .input-container{
        display: flex;
        flex-direction: column;
        width: 100%;
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