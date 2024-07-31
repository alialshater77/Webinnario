<script lang="ts">
	import * as m from '$paraglide/messages';

	import { PUBLIC_PLAY_URL } from '$env/static/public';
	import { languageTag } from '$paraglide/runtime';
	import { route } from '$lib/i18n-routing';
	import type { PageData } from '../$types';

    import CreateSubject from "./CreateQuestion.svelte"
	export let data: PageData;

	const title = m.create_title();
	const description = m.create_desc();
</script>

<svelte:head>
	<title>{title}</title>
	<meta property="og:title" content={title} />
	<meta name="description" content={description} />
	<meta property="og:description" content={description} />
	<link rel="canonical" href="{PUBLIC_PLAY_URL}{route('/create', languageTag())}" />
</svelte:head>

<CreateSubject />