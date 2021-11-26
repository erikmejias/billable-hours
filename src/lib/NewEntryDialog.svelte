<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { employeeRecord } from '$lib/stores';
	import type { CreateBillableResult, UserProjects } from './utils/Types';
	import { CREATE_BILLABLE_EVENT } from './utils/constants';
	import { formatBillableTime } from './utils/utils';

	const dispatch = createEventDispatcher();

	let selectedProject: UserProjects;

	let date: string;
	let time: number;
	let hours: number;
	let minutes: number;
	let workDescription: string;

	let canSubmit = false;

	function selectionResult(result: CreateBillableResult) {
		if (canSubmit) {
			if (result.selection === 'create') {
				result.billable = {
					date,
					time,
					workDescription
				};
				if (typeof selectedProject === 'string' && selectedProject !== 'Not listed')
					result.billable.project = selectedProject;
			}
			dispatch(CREATE_BILLABLE_EVENT, result);
		}
	}

	$: {
		time = formatBillableTime(hours, minutes);
		if (date && time && workDescription && selectedProject) canSubmit = true;
		else canSubmit = false;
	}
</script>

<div class="submit-time-component">
	<div class="submit-time-controls w-form">
		<form data-name="" class="submit-time-wrapper">
			<div class="form-field">
				<label for="node" class="field-label">Which day?</label>
				<input bind:value={date} type="date" class="button outlined w-button" />
			</div>
			<div class="form-field">
				<label for="node" class="field-label">How much work?</label>
				<div class="form-field_time">
					<select bind:value={hours} data-name="" class="input-field time w-select">
						<option value="0">0 hrs</option>
						<option value="1">1 hrs</option>
						<option value="2">2 hrs</option>
						<option value="3">3 hrs</option>
						<option value="4">4 hrs</option>
						<option value="5">5 hrs</option>
						<option value="6">6 hrs</option>
						<option value="7">7 hrs</option>
						<option value="8">8 hrs</option>
						<option value="9">9 hrs</option>
					</select>

					<select bind:value={minutes} data-name="" class="input-field time w-select">
						<option value="0">:00</option>
						<option value="15">:15</option>
						<option value="30">:30</option>
						<option value="45">:45</option>
					</select>
				</div>
			</div>
			<div class="form-field">
				<label for="name" class="field-label">Project</label>
				<select
					bind:value={selectedProject}
					id="project-selector"
					name="field"
					class="input-field w-select"
				>
					{#if !$employeeRecord.getProjects() || $employeeRecord.getProjects().length === 0}
						<option> Nothing available </option>
					{:else}
						<option>Select a project...</option>
						{#each $employeeRecord.getProjects() as project}
							<option value={project}>
								{project.projectName}
							</option>
						{/each}
						<option value="Not listed">My choice is not listed</option>
					{/if}
				</select>
			</div>
			<div class="form-field">
				<label for="node" class="field-label">Description</label><textarea
					bind:value={workDescription}
					data-name=""
					maxlength="5000"
					class="input-field w-input"
				/>
			</div>
			<div class="form-field">
				<label class="w-checkbox checkbox"
					><input
						type="checkbox"
						id="checkbox"
						name="checkbox"
						data-name="Checkbox"
						class="w-checkbox-input"
					/><span class="w-form-label">Note to staff</span></label
				>
			</div>
			<div class="form-action">
				<button
					on:click|preventDefault={() => selectionResult({ selection: 'create' })}
					class={canSubmit === true ? 'button w-button' : 'button disabled w-button'}>SUBMIT</button
				>
			</div>
		</form>
	</div>
</div>
