<script>
	import { createEventDispatcher } from 'svelte';
	import SaveButton from '../home/SaveButton.svelte';
	import { afterUpdate } from 'svelte';
import {workExperienceStore} from '../../lib/stores/workExperienceStore.js';
	let experienceEntries = [];
	let company = '';
	let designation = '';
	let joiningDate = '';
	let endDate = '';
	let totalWorkExperience = '';
	let showSuccessMessage = false;
	let errorMessage = '';

	const dispatch = createEventDispatcher();

	async function handleExperienceInformation() {
		// Validate start and end date
		if (!validateDates()) {
			return;
		}

		// Prepare data for API request
		const formData = {
			company,
			designation,
			joiningDate,
			endDate,
			totalWorkExperience
		};

		// Add the new experience entry to the array
		experienceEntries = [
			...experienceEntries,
			{ ...formData } // Create a copy of formData
		];
		workExperienceStore.set(experienceEntries)

		// Reset input fields
		company = '';
		designation = '';
		joiningDate = '';
		endDate = '';
		totalWorkExperience = '';

		// Reset error message
		errorMessage = '';

		// Show success message
		showSuccessMessage = true;

		// Hide success message after 1000ms
		setTimeout(() => {
			showSuccessMessage = false;
		}, 1000);

		try {
			// API endpoint URL
			const apiUrl = '/api/work-experience';
			const urlParts = window.location.href.split('/');
			const resumeId = urlParts.pop();

			// Add resumeId to formData
			formData.resumeId = resumeId;

			// API post request configuration
			const requestOptions = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formData)
			};

			// Send the API request
			const response = await fetch(apiUrl, requestOptions);
			const data = await response.json();

			// Dispatch event
			const insertedWorkExperienceId = data.workExperienceResult.id;
			dispatch('experienceData', insertedWorkExperienceId);
		} catch (error) {
			console.error('Error:', error);
			// Handle error and update error message if needed
		}
	}

	// Function to remove an experience entry
	function removeExperience(index) {
		experienceEntries.splice(index, 1);
		// Ensure reactivity by creating a new array
		experienceEntries = [...experienceEntries];	
			workExperienceStore.set(experienceEntries)

	}

	// Validate start and end date
	function validateDates() {
		if (!joiningDate || !endDate) {
			errorMessage = 'Please enter both start date and end date.';
			return false;
		}

		const startTimestamp = new Date(joiningDate).getTime();
		const endTimestamp = new Date(endDate).getTime();

		if (endTimestamp < startTimestamp) {
			errorMessage = 'End date cannot be less than start date.';
			return false;
		}

		errorMessage = '';
		return true;
	}

	// After update, reset the success message flag
	afterUpdate(() => {
		if (showSuccessMessage) {
			setTimeout(() => {
				showSuccessMessage = false;
			}, 1000);
		}
	});
</script>

<div class="flex flex-wrap">
	<!-- work experience -->
	<div class="w-full md:w-1/1 px-3 md:mb-0">
		<label
			class="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
			for="grid-institution"
		>
			Company
		</label>
		<input
			class="input-shade appearance-none block w-full text-gray-300 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
			id="grid-Company"
			type="text"
			placeholder=""
			bind:value={company}
		/>
	</div>
	<!-- designation -->
	<div class="w-full md:w-1/1 px-3 md:mb-0">
		<label
			class="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
			for="grid-designation"
		>
			Designation
		</label>
		<input
			class="input-shade appearance-none block w-full text-gray-300 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
			id="grid-designation"
			type="text"
			placeholder=""
			bind:value={designation}
		/>
	</div>

	<!-- joining date -->
	<div class="w-full md:w-1/2 px-3 md:mb-0 mt-2">
		<label
			class="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
			for="grid-joining-date"
		>
			joining date
		</label>
		<input
			class="input-shade appearance-none block w-full text-gray-300 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
			id="grid-joining-date"
			type="date"
			placeholder=""
			bind:value={joiningDate}
			on:change={validateDates}
		/>
	</div>
	<!-- end date -->
	<div class="w-full md:w-1/2 px-3 md:mb-0 mt-2">
		<label
			class="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
			for="grid-end-date"
		>
			end date
		</label>
		<input
			class="input-shade appearance-none block w-full text-gray-300 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
			id="grid-end-date"
			type="date"
			placeholder=""
			bind:value={endDate}
			on:change={validateDates}
		/>
	</div>
	<!-- total work experience -->
	<div class="w-full md:w-1/1 px-3 md:mb-0">
		<label
			class="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
			for="grid-total-work-experience"
		>
			total work experience
		</label>
		<input
			class="input-shade appearance-none block w-full text-gray-300 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
			id="grid-total-work-experience"
			type="text"
			placeholder=""
			bind:value={totalWorkExperience}
		/>
	</div>
	<!-- Error Message -->
	{#if errorMessage}
		<div class="text-xs text-red-500 mt-2">{errorMessage}</div>
	{/if}
	{#if showSuccessMessage}
		<div class="text-xs text-green-500 mt-2">Saved successfully!</div>
	{/if}
	<!-- Experience Entries -->
	<div class="w-full mt-4">
		{#each experienceEntries as { company, designation, joiningDate, endDate, totalWorkExperience }, index (index)}
			<div class="flex items-center space-x-2 mb-2" key={index}>
				<span class="bg-gray-300 text-gray-700 px-2 py-1 rounded">
					{company} - {designation} - {joiningDate} to {endDate} - {totalWorkExperience}
				</span>
				<button
					on:click={($event) => {
						$event.preventDefault();
						removeExperience(index);
					}}
					class="remove-btn">Remove</button
				>
			</div>
		{/each}
	</div>
	<!-- Submit Button -->
	<div class="flex justify-end w-full">
		<button class="save-btn" on:click|preventDefault={handleExperienceInformation}>
			<SaveButton>Save</SaveButton>
		</button>
	</div>
</div>
