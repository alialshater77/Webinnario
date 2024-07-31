<script>
	import { fly, fade } from 'svelte/transition';
	import db from '../../db';
	import { goto } from '$app/navigation';

	let email = '';
	let password = '';
	let errorMessage = '';

	async function submit() {
		try {
			const { data, error } = await db.signInWithEmail(email, password);
			if (error) throw error;

			// Store the token in localStorage
			localStorage.setItem('supabaseToken', data.session.access_token);

			// Redirect to a different page
			goto('/');
		} catch (error) {
			errorMessage = error.message;
		}
	}

	function focus(element) {
		element.focus();
	}

    function goToSignUpPage() {
        goto('/signup')
    }
</script>

<svelte:head>
	<title>Kanban</title>
</svelte:head>

<div class="wrapper">
	<div class="container" in:fade>
		<h1>Sign in</h1>

		<form on:submit|preventDefault={submit}>
			<label>
				<span>E-mail Address</span>
				<input name="email" type="email" required bind:value={email} use:focus />
			</label>
			<label>
				<span>Password</span>
				<input name="password" type="password" required bind:value={password} />
			</label>
			{#if errorMessage}
				<div class="error">{errorMessage}</div>
			{/if}
			<button>
				<svg
					class="icon"
					height="24"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
					/>
				</svg>
				<span>Log in</span>
			</button>
            <button type="button" on:click={goToSignUpPage}>Sign up</button>
		</form>
	</div>
</div>

<style>
	.wrapper {
		display: flex;
		justify-content: center;
		place-items: center;
		height: 100vh;
		width: 100vw;
	}
	.container {
		display: flex;
		flex-direction: column;
		min-width: 400px;
		padding: 4rem;
		background: #0005;
		border-radius: 3px;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	label {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	h1,
	h2 {
		color: white;
	}

	h1 {
		margin-top: 0;
	}

	label span {
		color: white;
	}

	input {
		display: block;
		width: 100%;
	}

	button {
		background: white;
		padding: 1rem;
		border-radius: 3px;
		background: #4dc7dc;
		font-size: 0.9rem;
		color: #444;
	}

	.icon {
		vertical-align: middle;
	}

	.error {
		color: red;
	}
</style>
