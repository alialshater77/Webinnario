<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import IconButton from './IconButton.svelte';
	import {theme} from '../stores';

	export let icons: [{ src: string; alt: string }, { src: string; alt: string }];
	export let size: string;
	export let data_set: string;

	export let state: boolean;

	$: icon = icons[state ? 1 : 0];

	const dispatch = createEventDispatcher<{
		change: boolean;
	}>();

	function toggleTheme(){
		console.log($theme);
		
		theme.set(!$theme)
	}
</script>

<IconButton
	src={icon.src}
	alt={icon.alt}
	{data_set}
	{size}
	on:click={() => {
		state = !state;
		dispatch('change', state);
		toggleTheme()
	}}
/>
