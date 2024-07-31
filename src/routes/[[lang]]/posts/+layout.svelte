<script>
	import Footer from '$lib/Footer.svelte';
	import MainHeader from '../MainHeader.svelte';
</script>

<main>
	<MainHeader />
	<div style:flex="1">
		<slot />
	</div>

</main>

<style>
	main {
		background-color: var(--background-color);
		line-height: 1.25;
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	footer{
		width: 100%;
	}

	div {
		flex: 1;
	}
</style>
