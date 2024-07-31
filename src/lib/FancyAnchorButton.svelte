<script lang="ts">
	import FancyAnchorButtonBase from './FancyAnchorButtonBase.svelte';
	// import { theme, applyTheme, toggleTheme } from '../routes/themeStore';
	// export let foregroundColor: string | undefined = undefined;
	// export let backgroundColor: string | undefined = undefined;
	// export let backgroundDeepColor: string | undefined = undefined;

// 	$: applyTheme($theme);

// 	function handleToggleTheme() {
//     toggleTheme();
//   }

	export let foregroundColor = '#FFFFFF';
	export let backgroundDeepColor = '#87923';


	export let backgroundColor = '#2563eb';


	function updateBackgroundColor() {
		backgroundColor = window.matchMedia('(prefers-color-scheme: dark)').matches ? '#3b82f6' : '#2563eb';
	}


	updateBackgroundColor();

	window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateBackgroundColor);

	export let href: string;
</script>

<FancyAnchorButtonBase
	foregroundColor={foregroundColor ?? '#FFFFFF'}
	backgroundColor={backgroundColor}
	backgroundDeepColor={backgroundDeepColor ?? '#87923'}
	{href}
>
	<div
		style:height="100%"
		style:padding="2px"
		style:font-weight="300"
		style:box-sizing="border-box"
	>
		<slot />
	</div>
</FancyAnchorButtonBase>
