<script lang="ts">
    import { onMount } from 'svelte';
    import { fetchClasses } from './api'; // Adjust the path if necessary
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let id: string;
    export let placeholder: string;
    export let required: boolean = false;
    export let disabled: boolean = false;
    export let value: string = '';
    export let maxHeight: string = '4em';

    let options: { id: string; name: string }[] = [];
    let error: string | null = null;
    let isOpen: boolean = false;
    let selectedOption: { id: string; name: string } | null = null;

    onMount(async () => {
        const response = await fetchClasses();

        if (response.error) {
            error = 'Failed to load classes'; // Handle the error appropriately
            console.error(response.error);
        } else {
            options = response.data.map(cls => ({ id: cls.id, name: cls.name }));
            if (value) {
                selectedOption = options.find(option => option.id === value) || null;
            }
        }
    });

    function toggleDropdown() {
        if (!disabled) {
            isOpen = !isOpen;
        }
    }

    function selectOption(option) {
        selectedOption = option;
        value = option.id;
        isOpen = false;
        dispatch('change', { value: option.id });
    }

    function handleClickOutside(event) {
        if (!event.target.closest(`#${id}`)) {
            isOpen = false;
        }
    }

    document.addEventListener('click', handleClickOutside);
</script>

<div class="dropdown" id={id} style:max-height={maxHeight}>
    <div class="dropdown-selected" on:click={toggleDropdown}>
        {#if selectedOption}
            {selectedOption.name}
        {:else}
            {placeholder}
        {/if}
    </div>
    {#if isOpen}
        <div class="dropdown-options">
            {#each options as option}
                <div class="dropdown-option" on:click={() => selectOption(option)}>
                    {option.name}
                </div>
            {/each}
        </div>
    {/if}
</div>

{#if error}
    <p>Error: {error}</p>
{/if}

<style>
    .dropdown {
        position: relative;
        display: inline-block;
        width: 100%;
        max-height: '4em';
    }

    .dropdown-selected {
        background: var(--background);
        font: inherit;
        font-weight: bold;
        border: 2px solid #e2e8f0;
        border-radius: 8px;
        width: 100%;
        color: inherit;
        box-sizing: border-box;
        text-align: center;
        padding: 8px 5px;
        margin-top: 10px;
        transition: border-color 100ms linear;
        cursor: pointer;
        background-color: var(--background);
    }

    .dropdown-selected:focus {
        outline: none;
        border-color: var(--accent-color);
    }

    .dropdown-options {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: var(--background);
        border: 2px solid #e2e8f0;
        border-top: none;
        border-radius: 0 0 8px 8px;
        z-index: 10;
        max-height: 150px; /* Adjust as needed */
        overflow-y: auto;
    }

    .dropdown-option {
        padding: 8px 5px;
        cursor: pointer;
        transition: background 100ms linear;
    }

    .dropdown-option:hover {
        background: var(--accent-color);
        color: var(--background-color);
    }
</style>
