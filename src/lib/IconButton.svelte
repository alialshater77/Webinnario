<script lang="ts">
	import Icon from './Icon.svelte';
	import {theme} from '../stores'
	export let src: string;
	export let alt: string;
	export let size: string;
	export let type: "button" | "submit" | "reset" | null | undefined
	export let data_set: string;
	export let disabled = false;
	export let padding = '0';
</script>

{#if data_set}

<button
	class:button-light={!$theme}
 	class:button-dark={$theme}
	style:font="inherit"
	style:display="flex"
	style:aspect-ratio="1/1"
	style:appearance="none"
	style:padding="4px"
	style:box-sizing="border-box"
	style:border="none"
	style:cursor={disabled ? 'normal' : 'pointer'}
	style:opacity={disabled ? '0.7' : '1'}
	style:color="inherit"
	{disabled}
	type={type}
	on:click
>
	<Icon {alt} {src} {size} />
</button>

{:else}

<button
	class:button-light={$theme}
 	class:button-dark={!$theme}
	style:font="inherit"
	style:display="flex"
	style:aspect-ratio="1/1"
	style:appearance="none"
	style:padding="4px"
	style:box-sizing="border-box"
	style:border="none"
	type={type}
	style:cursor={disabled ? 'normal' : 'pointer'}
	style:opacity={disabled ? '0.7' : '1'}
	style:color="inherit"
	{disabled}
	on:click
>
	<Icon {alt} {src} {size} />
</button>

{/if}


<style>
	
	.button-light {
		background: none;
		border-radius: 4px;
	}

	.button-light:where(:hover, :focus) {
		background: #f1f5f9;
	}

	.button-dark {
		background: none;
		border-radius: 4px;
	}

	.button-dark:where(:hover, :focus) {
		background: #1e293b;
	}
</style>
