<script lang="ts">
	import * as m from '$paraglide/messages';

	import GalleryCreation from './GalleryCreation.svelte';
	import { createDialog } from 'svelte-headlessui';
	import {theme} from "../../../stores"
	import { addIds, downloadFuiz } from '$lib';
	import FancyButton from '$lib/FancyButton.svelte';
	import { goto } from '$app/navigation';
	import Icon from '$lib/Icon.svelte';
	import ghost from '$lib/assets/ghost.svg';
	import { parse } from '@ltd/j-toml';
	import type { Creation, IdlessFuizConfig, Media } from '$lib/types';
	import { isNotUndefined } from '$lib/util';
	import TypicalPage from '$lib/TypicalPage.svelte';
	import {
		getCreation,
		type Database,
		deleteCreation,
		addCreation,
		generateUuid
	} from '$lib/storage';
	import { login, logout } from '$lib/remoteStorage';
	import type { PageData } from './$types';
	import { env } from '$env/dynamic/public';
	import { share } from './lib';
	import JSZip from 'jszip';
	import { page } from '$app/stores';
	import Footer from '$lib/Footer.svelte';

	export let creations: Creation[];

	export let db: Database;
	export let data: PageData;

	$: sortedCreations = creations.sort((a, b) => b.lastEdited - a.lastEdited);

	async function addSlide() {
		let newSlide = {
			lastEdited: Date.now(),
			uniqueId: generateUuid(),
			versionId: 0,
			config: {
				title: m.untitled(),
				slides: []
			}
		};

		let id = await addCreation(newSlide, db);

		creations = [
			...creations,
			{
				id,
				lastEdited: newSlide.lastEdited,
				title: newSlide.config.title,
				slidesCount: newSlide.config.slides.length
			}
		];

		goto(`?id=${id}`);
	}

	async function deleteSlide(id: number) {
		await deleteCreation(id, db);
		creations = creations.filter((c) => c.id != id);
	}

	const dialog = createDialog();
	let selectedToDeletion = 0;

	let fileInput: HTMLInputElement;

	function loadFromInput() {
		const target = document.querySelector('input[type=file]');
		if (!target) {
			return;
		}
		const inputImage = target as HTMLInputElement;
		const filesList = inputImage.files;
		if (!filesList) {
			return;
		}
		const files = [];
		for (let i = 0; i < filesList.length; i += 1) {
			const file = filesList.item(i);
			if (file) {
				files.push(file);
			}
		}
		loadFile(files);
	}

	function handleSubjectButtonClick() {
		goto('/create-subject');
	}
	function handleQuestionsButtonClick() {
		goto('/create-questions');
	}

	async function loadFile(files: File[]) {
		const exportedFuizzesWithFailures = await Promise.all(
			files.map(async (file) => {
				if (file.name.endsWith('.zip')) {
					const mimetypes = new Map([
						['apng', 'image/apng'],
						['avif', 'image/avif'],
						['gif', 'image/gif'],
						['jpg', 'image/jpeg'],
						['png', 'image/png'],
						['svg', 'image/svg+xml'],
						['webp', 'image/webp']
					]);

					const archive = new JSZip();
					await archive.loadAsync(file);
					const images = Object.keys(archive.files)
						.filter((name) => !name.endsWith('.toml'))
						.map((name) => ({
							name,
							file: archive.files[name]
						}));

					const fuiz = Object.keys(archive.files)
						.filter((name) => name.endsWith('.toml'))
						.map((name) => archive.files[name])
						.at(0);

					const betterImages: {
						name: string;
						base64: string;
					}[] = [];

					for (const { name, file } of images) {
						const base64 =
							'data:' +
							mimetypes.get(file.name.split('.').at(-1) ?? 'png') +
							';base64,' +
							(await file.async('base64'));
						betterImages.push({ name, base64 });
					}

					if (!fuiz) return undefined;

					const str = await fuiz.async('string');
					const detomlified = parse(str, { bigint: false }) as IdlessFuizConfig;

					const unurlify = (imageUrl: string): string => {
						return betterImages.find(({ name }) => name === imageUrl)?.base64 ?? '';
					};

					return {
						...detomlified,
						slides: detomlified.slides.map((s) => ({
							MultipleChoice: {
								...s.MultipleChoice,
								...(s.MultipleChoice.media &&
									'Url' in s.MultipleChoice.media.Image && {
										media: {
											Image: {
												Base64: {
													alt: s.MultipleChoice.media.Image.Url.alt,
													data: unurlify(s.MultipleChoice.media.Image.Url.url),
													hash: s.MultipleChoice.media.Image.Url.url.split('.')[0]
												}
											}
										}
									})
							}
						}))
					};
				} else {
					return new Promise<IdlessFuizConfig | undefined>((resolve) => {
						const reader = new FileReader();
						reader.readAsText(file);
						reader.addEventListener('load', () => {
							const str = reader.result?.toString();
							if (str) {
								const detomlified = parse(str, { bigint: false }) as IdlessFuizConfig;
								resolve(detomlified);
							} else {
								resolve(undefined);
							}
						});
					});
				}
			})
		);

		await Promise.all(
			exportedFuizzesWithFailures.filter(isNotUndefined).map(async (config) => {
				const idedConfig = addIds(config);

				const fuiz = {
					config: idedConfig,
					uniqueId: generateUuid(),
					versionId: 0,
					lastEdited: Date.now()
				};

				const id = await addCreation(fuiz, db);

				creations = [
					...creations,
					{
						id,
						lastEdited: fuiz.lastEdited,
						title: idedConfig.title,
						slidesCount: idedConfig.slides.length,
						media: idedConfig.slides.reduce<Media | undefined>(
							(p, c) => p || c.MultipleChoice.media,
							undefined
						)
					}
				];
			})
		);
	}
</script>

<TypicalPage>
	<div style:display="flex" style:flex-direction="column" style:height="100%" style:justify-content="space-between">
		<div
		style:display="flex"
		style:justify-content="center"
		style:gap="0.5em"
		style:flex-wrap="wrap"
		style:padding="0 0.5em"
	>
	<div class="buttons-container">
		<div>
			<FancyButton on:click={addSlide}>
				<div
					style:display="flex"
					style:align-items="center"
					style:font-family="Raleway"
					style:gap="0.2em"
					style:padding="0.15em 0.25em"
					style:justify-content="center"
				>
					<Icon size="1.25em" src="$lib/assets/file_new.svg" alt={m.start_blank()} />
					<div>{m.start_blank()}</div>
				</div>
			</FancyButton>
		</div>
		{#if env.PUBLIC_GOOGLE === 'true'}
			{#if data.google}
				<div>
					<FancyButton on:click={() => logout('google')}>
						<div
							style:display="flex"
							style:align-items="center"
							style:font-family="Raleway"
							style:gap="0.2em"
							style:padding="0.15em 0.25em"
							style:justify-content="center"
						>
							<Icon size="1.25em" src="$lib/assets/drive.svg" alt="Log out from Google Drive" />
							<div>Log Out</div>
						</div>
					</FancyButton>
				</div>
			{:else}
				<div>
					<FancyButton on:click={() => login('google')}>
						<div
							style:display="flex"
							style:align-items="center"
							style:font-family="Raleway"
							style:gap="0.2em"
							style:padding="0.15em 0.25em"
							style:justify-content="center"
						>
							<Icon
								size="1.25em"
								src="$lib/assets/drive.svg"
								alt="Synchronize your data with Google Drive"
							/>
							<div>Backup</div>
						</div>
					</FancyButton>
				</div>
			{/if}
		{/if}
		
		{#if env.PUBLIC_AUTH === 'true'}
			{#if $page.data.session}
				<div>
					<FancyButton on:click={() => logout('oauth')}>
						<div
							style:display="flex"
							style:align-items="center"
							style:font-family="Raleway"
							style:gap="0.2em"
							style:padding="0.15em 0.25em"
							style:justify-content="center"
						>
							<Icon size="1.25em" src="$lib/assets/logout.svg" alt="Log out from OpenCollective" />
							<div>Log Out</div>
						</div>
					</FancyButton>
				</div>
			{:else}
				<div>
					<FancyButton on:click={() => login('oauth')}>
						<div
							style:display="flex"
							style:align-items="center"
							style:font-family="Raleway"
							style:gap="0.2em"
							style:padding="0.15em 0.25em"
							style:justify-content="center"
						>
							<Icon
								size="1.25em"
								src="$lib/assets/login.svg"
								alt="Synchronize your data with OpenCollective"
							/>
							<div>Backup</div>
						</div>
					</FancyButton>
				</div>
			{/if}
		{/if}
		
			<input
				bind:this={fileInput}
				style:display="none"
				type="file"
				id="config"
				accept="application/toml, .toml, application/x-zip, .zip"
				name="config"
				multiple
				on:change={loadFromInput}
			/>
			<FancyButton on:click={() => fileInput.click()}>
				<div
					style:display="flex"
					style:align-items="center"
					style:font-family="Raleway"
					style:gap="0.2em"
					style:padding="0.15em 0.25em"

					style:justify-content="center"
				>
					<Icon size="1.25em" src="$lib/assets/file_open.svg" alt={m.open_file()} />
					<div>{m.open_file()}</div>
				</div>
			</FancyButton>
			<FancyButton on:click={handleSubjectButtonClick}>
				<div
					style:display="flex"
					style:align-items="center"
					style:font-family="Raleway"
					style:gap="0.2em"
					style:padding="0.15em 0.25em"

					style:justify-content="center"
				>
					<Icon size="1.25em" src="$lib/assets/file_open.svg" alt={m.open_file()} />
					<div>Add Subjects</div>
				</div>
			</FancyButton>
			<FancyButton on:click={handleQuestionsButtonClick}>
				<div
					style:display="flex"
					style:align-items="center"
					style:font-family="Raleway"
					style:gap="0.2em"
					style:padding="0.15em 0.25em"

					style:justify-content="center"
				>
					<Icon size="1.25em" src="$lib/assets/file_open.svg" alt={m.open_file()} />
					<div>Add Questions</div>
				</div>
			</FancyButton>
		</div>
	</div>
	<div style:margin="0 0.4em">
		<div
			style:max-width="70ch"
			style:padding="0.7em 0.5em"
			style:box-sizing="border-box"
			style:margin="1em auto"
			class:light={$theme}
			class:dark={!$theme}
			
			style:border-radius="8px"
		>
			<h2
				style:font-family="Montserrat"
				style:line-height="1"
				style:margin="0 0 0.2em"
				style:padding="0.2em 0"
				style:display='flex'
				style:width="100%"
				style:justify-content="flex-start"
				class:light-h2={$theme}
				class:dark-h2={!$theme}
			>
				{m.recent_fuizzes()}
			</h2>
			{#if sortedCreations.length}
				<div
					style:display="grid"
					style:grid-template-columns="repeat(auto-fit, minmax(12ch, 1fr))"
					style:grid-auto-rows="1fr"
					style:grid-gap="0.4em"
				>
					{#each sortedCreations as { id, title, lastEdited, slidesCount, media }}
						<GalleryCreation
							{id}
							{title}
							{lastEdited}
							{slidesCount}
							{media}
							on:delete={() => {
								selectedToDeletion = id;
								dialog.open();
							}}
							on:play={() => goto('host?id=' + id)}
							on:download={async () => {
								const creation = await getCreation(id, db);
								if (!creation) return;
								const configJson = creation.config;
								await downloadFuiz(configJson);
							}}
							on:share={async (e) => {
								const creation = await getCreation(id, db);
								if (creation) {
									await share(creation.config, $page.data.user ? creation.uniqueId : undefined);
								}
								e.detail.show();
							}}
						/>
					{/each}
					{#if $dialog.expanded}
						<div
							style:position="fixed"
							class:layout-light={$theme} class:layout-dark={!$theme}
							style:display="flex"
							style:padding="0.5em"
							style:inset="0"
							style:z-index="1"
						>
							<div
								style:margin="auto"
								class:card-light={$theme} class:card-dark={!$theme}
								style:padding="0.7em"
								style:border-radius="8px"
								style:width="50%"
								style:max-width="50ch"

								use:dialog.modal
							>
								<h3 style:margin="0 0 0.4em">{m.delete_forever()}</h3>
								<div style:display="flex" style:gap="0.5em" style:flex-wrap="wrap" style:width="100%" style:justify-content="center">
									<div >
										<FancyButton
											backgroundColor="var(--background-color)"
											backgroundDeepColor="currentcolor"
											foregroundColor="currentColor"
											on:click={dialog.close}
										>
											<div >{m.cancel()}</div>
										</FancyButton>
									</div>
									<div >
										<FancyButton
											backgroundColor="var(--background-color)"
											backgroundDeepColor="currentcolor"
											foregroundColor="currentColor"
											on:click={() => {
												deleteSlide(selectedToDeletion);
												dialog.close();
											}}
										>
											<div >{m.delete_confirm()}</div>
										</FancyButton>
									</div>
								</div>
							</div>
						</div>
					{/if}
				</div>
			{:else}
				<div
					style:display="flex"
					style:flex-direction="column"
					style:align-items="center"
					style:opacity="0.3"
				>
					<Icon src={ghost} size="min(20vh, 60vw)" alt={m.nothing()} />
					{m.nothing()}
				</div>
			{/if}
		</div>
	</div>

	<footer style:width="100%">
		<Footer />
	</footer>
	</div>
</TypicalPage>






<style>

	.layout-dark{
		--secondary: #1e293b;
		background : color-mix(in srgb, var(--secondary) 85%, transparent)
	}

	.layout-light{
		--secondary: #f1f5f9;
		background :color-mix(in srgb, var(--secondary) 85%, transparent)
	}

	.buttons-container{
		display: flex;
		width: 100%;
		justify-content: center;
		align-items: center;
		gap: 1rem;
	}

	.card-dark{
		--background: #020817;
		background : var(--background) 
	}

	.card-light{
		--background: #FFFFFF;
		background :var(--background)
	}
	.dark{
		--background: #020817;
			--color: #FFFFFF;
			--palette-light: #FFFFFF;
			--foreground: #f8fafc;
			--card: #020817;
			--card-foreground: #f8fafc;
			--popover: #020817;
			--popover-foreground: #f8fafc;
			--primary: #3b82f6;
			--primary-foreground: #0f192a;
			--secondary: #1e293b;
			--secondary-foreground: #f8fafc;
			--muted: #1e293b;
			--muted-foreground: #94a3b8;
			--accent: #1e293b;
			--accent-foreground: #f8fafc;
			--destructive: #7f1d1d;
			--destructive-foreground: #f8fafc;
			--border: #1e293b;
			--input: #1e293b;
			--ring: #1d4ed8;
		border: 0.1em solid var(--border);
	}	

	.light{
		--background: #FFFFFF;
		--color: #020817;
		
		--palette-dark: #020817;
		--accent-color: #2563eb;
		--foreground: #020817;
		--card: #ffffff;
		--card-foreground: #020817;
		--popover: #ffffff;
		--popover-foreground: #020817;
		--primary: #2563eb;
		--primary-foreground: #f8fafc;
		--secondary: #f1f5f9;
		--secondary-foreground: #0f172a;
		--muted: #f1f5f9;
		--muted-foreground: #64748b;
		--accent: #f1f5f9;
		--accent-foreground: #0f172a;
		--destructive: #dc2626;
		--destructive-foreground: #f8fafc;
		--border: #e2e8f0;
		--input: #e2e8f0;
		--ring: #2563eb;
		--radius: 0.5rem;
		border: 0.1em solid var(--border);
	}

	.light-h2{
		border-bottom: 0.07em solid var(--border);
	}

	.dark-h2{
		border-bottom: 0.07em solid var(--border);
	}
</style>
