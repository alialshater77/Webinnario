<script lang="ts">
	import FancyButton from './FancyButton.svelte';
	import { createListbox } from 'svelte-headlessui';

	export let options: string[] | number[];
	export let selected: string | number;

	export let map: (a: string) => string = (a) => a;

	const listbox = createListbox({ label: 'Actions', selected });

	function onSelect(e: Event) {
		selected = (e as CustomEvent).detail.selected;
	}
</script>

<FancyButton action={listbox.button} on:select={onSelect}>
	<div style:display="flex" style:align-items="center" style:justify-content="center">
		<slot />
		<div style:padding="0 5px" style:text-transform="capitalize">
			{map(selected.toString())}
		</div>
	</div>
</FancyButton>

{#if $listbox.expanded}
	<div id="container">
		<ul use:listbox.items>
			{#each options as value}
				<li>
					<FancyButton action={(n) => listbox.item(n, { value })}>
						<div style:padding="0.25em 0.5em" style:text-transform="capitalize">
							{map(value.toString())}
						</div>
					</FancyButton>
				</li>
			{/each}
		</ul>
	</div>
{/if}

<style>
	#container {
		position: fixed;
		z-index: 1;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
		background-color: color-mix(in srgb, var(--background-color) 80%, transparent);
		backdrop-filter: blur(4px);

		display: flex;
		align-items: center;
		justify-content: center;

		& ul {
			margin: 0;
			padding: 10px;
			display: grid;
			grid-gap: 10px;
			font-size: max(7vmin, 1em);
			grid-template-columns: repeat(auto-fit, minmax(8ch, 1fr));
			width: min(80vw, 90vh);
			flex-wrap: wrap;

			& li {
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}
	}
</style>
