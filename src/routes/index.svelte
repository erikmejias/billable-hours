<script lang="ts">
	import { goto } from '$app/navigation';

	import { employeeRecord } from '$lib/stores';

	let email: string;
	let password: string;

	function redirectToProfile() {
		goto(`/profile`);
	}

	async function handleSignIn() {
		if (email && password) employeeRecord.auth(email, password);
		else console.log('Inputs cannot be empty.');
	}

	$: {
		if ($employeeRecord) redirectToProfile();
	}
</script>

<svelte:head>
	<title>&#123;fs Billable</title>
</svelte:head>

<div class="navigation">
	<div class="navigation-wrapper">
		<img
			src="https://assets.website-files.com/611bd8f18a938980910797d2/615c605610ac087f70c3addb_finternal.svg"
			loading="lazy"
			alt=""
			class="logo-medium"
		/>
	</div>
</div>
<div class="section-login wf-section">
	<div class="login-component">
		<h1>Get in</h1>
		<div class="w-form">
			<form id="email-form" name="email-form" data-name="Email Form" class="login-controls">
				<div class="form-control">
					<label for="node">Email</label><input
						bind:value={email}
						type="email"
						maxlength="256"
						data-name=""
						placeholder=""
						class="input-field w-input"
					/>
				</div>
				<div class="form-control">
					<label for="node">Password</label><input
						bind:value={password}
						type="password"
						maxlength="256"
						data-name=""
						class="input-field w-input"
					/>
				</div>
				<div class="form-action">
					<button on:click|preventDefault={handleSignIn} class="button w-button">Continue</button>
				</div>
			</form>
		</div>
	</div>
</div>
