<script lang="ts">
	import { afterUpdate, beforeUpdate } from 'svelte';

	export let id: string;
	export let placeholder: string;
	export let required: boolean;
	export let disabled: boolean;
	export let value: string;
	export let maxHeight = '4em';
	export let maxLength: number | undefined = undefined;

	let editableElement: HTMLTextAreaElement;

	beforeUpdate(async () => {
		value = value.replaceAll('\n', '').replaceAll('\r', '');
	});

	afterUpdate(async () => {
		editableElement.style.height = '0';
		editableElement.style.height = (editableElement.scrollHeight + 4).toString() + 'px';
	});
</script>

<div style:position="relative" style:width="100%">
	<textarea
		style:max-height={maxHeight}
		bind:this={editableElement}
		{id}
		name={id}
		{required}
		{disabled}
		bind:value
		placeholder=""
		maxlength={maxLength}
	/>
	<label for={id}>{placeholder}</label>
</div>

<style>
	div {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	label {
		text-align: center;
		color: color-mix(in srgb, currentColor 50%, transparent);
		padding: 0 8px;
		position: absolute;
		pointer-events: none;
		border-radius: 5px 5px 0 0;
		top: 60%;
		transform: translateY(-50%);
		line-height: 1em;
		transform-origin: top;
		transition: all 100ms linear;
	}

	textarea:where(:not(:placeholder-shown), :focus, :active) + label {
		top: -5px;
		
		scale: 0.75;
		background: var(--background-color);
		transform: translateY(-50%);
	}

	textarea:focus + label {
		color: var(--accent-color);
	}

	textarea {
		background: none;
		font: inherit;
		font-weight: bold;
		border: 2px solid #e2e8f0;
		border-radius: 8px;
		width: 100%;
		color: inherit;
		box-sizing: border-box;
		text-align: center;
		padding: 8px 5px;
		width: 100%;
		resize: none;
		margin-top: 10px;
		transition: border-color 100ms linear;
	}

	textarea:focus {
		outline: none;
		border-color: var(--accent-color);
	}
</style>
