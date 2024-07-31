<script lang="ts">
	import logo from '$lib/assets/logo.png';
	import { inlineSvg } from '@svelte-put/inline-svg';

	export let height = 60;
</script>

<div style:height="100%" style:display="flex" style:aspect-ratio="11/4">
	<div style:margin-right="auto" style:display="flex" style:width="auto" style:height="{height}px">
		<img height="100%" width="100%" src={logo} alt="logo" />
	</div>
</div>
