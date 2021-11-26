<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { employeeRecord } from '$lib/stores';
	import { STATUS_DEFAULT, STATUS_FAIL, STATUS_SUCCESS } from '$lib/utils/constants';
	import { formatBillableTime } from '$lib/utils/utils';
	import type { CreateBillableResult, SubmittedHistory, UserProjects } from '$lib/utils/Types';
	import BillableHistory from '$lib/BillableHistory.svelte';
	import NewEntryDialog from '$lib/NewEntryDialog.svelte';

	let userProjects: UserProjects[];
	let userHistory: SubmittedHistory[];
	let selectedProject: UserProjects;
	let billableTime: number;
	let hours: number;
	let minutes: number;
	let workDescription: string;
	let status = STATUS_DEFAULT;

	let menuSelection = 1;

	let userFullName: string = '';

	let displayDialog: boolean = false;

	console.log($employeeRecord);

	onMount(() => {
		// Initialize user session
		employeeRecord.userSession();
		if (!$employeeRecord) redirectLogin();
		employeeRecord.fetchProjects();

		console.log($employeeRecord);
	});

	function redirectLogin() {
		goto(`/`);
	}

	async function submitBillableTime(event: CustomEvent) {
		// Hide dialog and save result.
		displayDialog = false;
		const result: CreateBillableResult = event.detail;
		console.log(result);

		if (result.selection === 'create') employeeRecord.submitBillableTime(result.billable);

		// Update projects list.
		employeeRecord.fetchProjects();

		// Return to history view
		menuSelection = 1;
	}

	$: {
		billableTime = formatBillableTime(hours, minutes);

		if ($employeeRecord) {
			userFullName = $employeeRecord.getName();
			userProjects = $employeeRecord.getProjects();
			userHistory = $employeeRecord.getBillableHistory();
		}
	}
</script>

<svelte:head>
	<title>FS Internal</title>
</svelte:head>

<div class="profile-component">
	<div class="profile-dashboard">
		<div class="profile-dashboard_top-menu">
			<div class="account-title">{userFullName}</div>
		</div>
		<div class="profile-dashboard_content">
			<div class="profile-navigation">
				<div
					on:click={() => (menuSelection = 1)}
					class={menuSelection === 1 ? 'profile-sidebar_option selected' : 'profile-sidebar_option'}
				>
					<div>History</div>
				</div>
				<div
					on:click={() => (menuSelection = 2)}
					class={menuSelection === 2 ? 'profile-sidebar_option selected' : 'profile-sidebar_option'}
				>
					<div>Compose New</div>
				</div>
			</div>
			<div class="profile-content">
				{#if menuSelection === 1}
					<div class="history-component">
						{#if userHistory}
							{#each userHistory as project}
								<BillableHistory {project} />
							{/each}
						{/if}
					</div>
				{:else}
					<NewEntryDialog on:createBillableEntry={submitBillableTime} />
				{/if}
			</div>
		</div>
	</div>
</div>
