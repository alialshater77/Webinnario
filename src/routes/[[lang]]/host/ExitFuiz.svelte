<script lang="ts">
	import * as m from '$paraglide/messages';

	import FancyButton from '$lib/FancyButton.svelte';
	import { createDialog } from 'svelte-headlessui';
	import Icon from '$lib/Icon.svelte';
	import icon from '$lib/assets/icon.png';
	import { goto } from '$app/navigation';

	const exitDialog = createDialog({ label: m.end_fuiz() });
</script>

<button
	on:click={exitDialog.open}
	style:cursor="pointer"
	style:appearance="none"
	style:display="flex"
	style:padding="0.2em 0.8em"
	style:gap="2px"
	style:align-items="center"
	style:line-height="1em"
	style:font-size="inherit"
	style:font-family="Motserrat"
	style:background="var(--color)"
	style:color="var(--background)"
	style:border="none"
	style:border-radius="100px"
>
	
	<div>Exit?</div>
</button>
{#if $exitDialog.expanded}
	<div
		style:position="fixed"
		style:z-index="5"
		style:inset="0"
		style:width="100%"
		style:height="100%"
		style:display="flex"
		style:align-items="center"
		style:justify-content="center"
		style:background="#000000A0"
	>
		<div
			use:exitDialog.modal
			style:background="var(--background)"
			style:padding="20px"
			style:margin="20px"
			style:display="flex"
			style:flex-direction="column"
			style:gap="20px"
			style:border-radius="10px"
		>
			<h1
				style:font-family="Montserrat"
				style:text-align="center"
				style:line-height="1"
				style:margin="0"
			>
				{m.end_fuiz()}
			</h1>
			<div
				style:display="flex"
				style:flex-wrap="wrap"
				style:justify-content="center"
				style:align-items="center"
				style:gap="20px"
				style:width="30ch"
				style:max-width="80vw"
			>
				<div style:flex="1" class="btn">
					<FancyButton
						on:click={exitDialog.close}
					>
						<div style:padding="5px 10px" style:white-space="nowrap">{m.cancel()}</div>
					</FancyButton>
				</div>
				<div style:flex="1" class="btn">
					<FancyButton on:click={() => goto('create')}>
						<div style:padding="5px 10px" style:white-space="nowrap">{m.end()}</div>
					</FancyButton>
				</div>
			</div>
		</div>
	</div>
{/if}


<style>
	.btn{
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
