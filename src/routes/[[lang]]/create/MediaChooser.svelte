<script lang="ts">
	import * as m from '$paraglide/messages';

	import { buttonColors } from '$lib';
	import delete_image from '$lib/assets/delete.svg';
	import add_photo from '$lib/assets/add_photo.svg';
	import MediaDisplay from '$lib/MediaDisplay.svelte';
	import Icon from '$lib/Icon.svelte';
	import Textarea from '$lib/Textarea.svelte';
	import IconButton from '$lib/IconButton.svelte';
	import type { Media } from '$lib/types';
	import tippy from 'tippy.js';

	export let media: Media | null | undefined;

	let dragOver = false;

	function load_from_input() {
		const target = document.querySelector('input[type=file]');
		if (target) {
			const inputImage = target as HTMLInputElement;
			loadFile(inputImage.files?.item(0) ?? undefined);
		}
	}

	function loadFile(file: File | undefined) {
		dragOver = false;
		if (file == undefined) {
			media = undefined;
			return;
		}
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.addEventListener('load', () => {
			media = {
				Image: {
					Base64: {
						data: reader.result?.toString() ?? '',
						alt: ''
					}
				}
			};
		});
	}
</script>

{#if !media}
	<div style:flex="1" style:padding="10px" style:display="flex" style:justify-content="center">
		<input
			style:display="none"
			type="file"
			name="image_input"
			accept="image/png, image/jpeg, image/gif, image/webp"
			id="image_input"
			on:change={load_from_input}
		/>
		<button
			style:appearance="none"
			style:color="inherit"
			style:border="none"
			style:padding="none"
			style:font="inherit"
			style:background="none"
			on:dragover|preventDefault={() => {
				dragOver = true;
			}}
			on:dragenter={() => {
				dragOver = true;
			}}
			on:dragleave={() => {
				dragOver = false;
			}}
			on:drop|preventDefault={(e) => {
				dragOver = false;
				const files = e.dataTransfer?.files ?? undefined;
				if (files && files.length > 0) {
					loadFile(e.dataTransfer?.files?.item(0) ?? undefined);
				}
			}}
		>
			<div
				style:aspect-ratio="1"
				style:width="15ch"
				style:background={dragOver ? buttonColors[0][0] : 'transparent'}
				style:border="0.12em dashed {dragOver ? '#fff' : '#e2e8f0'}"
				style:border-radius="8px"
				style:padding="0.4em"
				style:box-sizing="border-box"
				style:display="flex"
				style:flex-direction="column"
				style:align-items="center"
				style:gap="0.4em"
				style:transition="background 200ms"
				style:color={dragOver ? '' : '#e2e8f0'}
			>
				<label
					for="image_input"
					style:flex="1"
					style:display="flex"
					style:flex-direction="column"
					style:align-items="center"
					style:cursor="pointer"
					style:justify-content="center"
				>
					<Icon size="2em" src={add_photo} alt={m.open_image()} />
					<div style:font-weight="bold">{m.open_image()}</div>
				</label>
				<div style:font-size="0.7em" style:font-weight="bold">{m.drop_here()}</div>
			</div>
		</button>
	</div>
{:else if 'Image' in media}
	{#if 'Base64' in media.Image}
		<div
			style:display="flex"
			style:flex-direction="column"
			style:border="0.15em solid #e2e8f0"
			style:flex="1"
			style:border-radius="8px"
			style:gap="0.4em"
			style:padding="0.6em"
			style:box-sizing="border-box"
			style:max-width="40ch"
			style:min-width="15ch"
			style:margin="auto"
			style:margin-top="20px"
			style:margin-bottom="20px"
		>
			<div style:display="flex" style:align-items="center">
				<div style:flex="1" style:text-align="center" style:font-family="Poppins">
					{m.local_image()}
				</div>
				<IconButton
					src={delete_image}
					alt={m.remove()}
					size="1.2em"
					on:click={() => {
						media = undefined;
					}}
				/>
			</div>
			<div
				style:flex-direction="column"
				style:align-items="stretch"
				style:display="flex"
				style:gap="0.4em"
			>
				<div
					style:width="100%"
					style:height="100%"
					style:max-width="10em"
					style:min-width="5em"
					style:position="relative"
					style:max-height="10em"
					style:display="flex"
					style:flex-direction="column"
					style:overflow="auto"
					style:margin="auto"
				>
					<MediaDisplay {media} fit="contain" />
				</div>
				<div style:display="flex" style:align-items="center" style:gap="10px">
					<div style:flex="1">
						<Textarea
							id="alt"
							required={false}
							disabled={false}
							maxHeight="5em"
							bind:value={media.Image.Base64.alt}
							placeholder={m.image_alt()}
						/>
					</div>
					<div id="alt-help">
						<IconButton
							size="1.2em"
							src="$lib/assets/help.svg"
							alt={m.image_alt()}
							on:click={() => {
								let element = document.getElementById('alt-help');
								if (!element) return;
								const instance = tippy(element, {
									trigger: 'manual',
									content: m.image_alt_desc(),
									arrow: false,
									theme: 'fuiz'
								});

								instance.show();
							}}
						/>
					</div>
				</div>
			</div>
		</div>
	{/if}
{/if}
