<script>
	import * as m from '$paraglide/messages';

	import heart from '$lib/assets/cards-heart.svg';
	import club from '$lib/assets/cards-club.svg';
	import spade from '$lib/assets/cards-spade.svg';
	import diamond from '$lib/assets/cards-diamond.svg';
</script>

<div  style:display="flex" style:flex-direction="column" style:height="100%" style:justify-content="space-between" style:position="relative">
	<div
		style:background-color="var(--background-color)"
		style:inset="0"
		style:position="absolute"
		style:overflow="hidden"
		style:z-index="-1"
	>
		<div style:width="100%">
			<div style:display="flex" style:flex-wrap="wrap" style:opacity="20%" style:height="100%">
				<div class="card-container" style:transform="scale(1) translate(0%, 0%) rotate(0.0625turn)">
					<!-- <img src={heart} alt={m.heart()} /> -->
				</div>
				<div
					class="card-container"
					style:transform="scale(1) translate(0%, -25%) rotate(-0.0625turn)"
				>
					<!-- <img src={diamond} alt={m.diamond()} /> -->
				</div>
				<div
					class="card-container"
					style:transform="scale(1) translate(-25%, 12.5%) rotate(-0.0625turn)"
				>
					<!-- <img src={spade} alt={m.spade()} /> -->
				</div>
				<div
					class="card-container"
					style:transform="scale(1) translate(12.5%, -25%) rotate(0.0625turn)"
				>
					<!-- <img src={club} alt={m.club()} /> -->
				</div>
			</div>
		</div>
	</div>
	<div style:height="100%" >
		<slot />
	</div>
</div>

<style>
	.card-container {
		height: 50%;
		width: 50%;
	}

	.card-container img {
		height: 100%;
		width: 100%;
	}
</style>
