<script>
	import { createEventDispatcher } from 'svelte';
	import SaveButton from '../home/SaveButton.svelte';
	import { afterUpdate } from 'svelte';
  
	let projectEntries = [];
	let projectTitle = '';
	let projectDescription = '';
	let startDate = '';
	let endDate = '';
	let showSuccessMessage = false;
	let errorMessage = '';
  
	const dispatch = createEventDispatcher();
  
	function handleProjectInformation() {
	  // Validate start date and end date
	  if (!validateDates()) {
		return;
	  }
  
	  // Add the new project entry to the array
	  projectEntries = [...projectEntries, { projectTitle, projectDescription, startDate, endDate }];
  
	  // Reset input fields
	  projectTitle = '';
	  projectDescription = '';
	  startDate = '';
	  endDate = '';
  
	  // Reset error message
	  errorMessage = '';
  
	  // Show success message
	  showSuccessMessage = true;
  
	  // Hide success message after 1000ms
	  setTimeout(() => {
		showSuccessMessage = false;
	  }, 1000);
  
	  // Save project information to the server
	  saveProjectInformation();
	}
  
	// Function to remove a project entry
	function removeProject(index) {
	  projectEntries.splice(index, 1);
	  // Ensure reactivity by creating a new array
	  projectEntries = [...projectEntries];
	}
  
	// Validate start date and end date
	function validateDates() {
	  if (!startDate || !endDate) {
		errorMessage = 'Please enter both start date and end date.';
		return false;
	  }
  
	  const startTimestamp = new Date(startDate).getTime();
	  const endTimestamp = new Date(endDate).getTime();
  
	  if (endTimestamp < startTimestamp) {
		errorMessage = 'End date cannot be less than start date.';
		return false;
	  }
  
	  errorMessage = ''; // Reset error message
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
  
	// Function to save project information to the server
	function saveProjectInformation() {
	  const formData = {
		projectEntries
	  };
  
	  // API endpoint URL
	  const apiUrl = '/api/project';
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
	  fetch(apiUrl, requestOptions)
		.then((response) => response.json())
		.then((data) => {
		  console.log('API Response:', data);
		  // Optionally, you can dispatch an event or handle the response as needed
		})
		.catch((error) => console.error('Error:', error));
	}
  </script>
  
  <div class="flex flex-wrap">
	<!-- projects -->
	<div class="w-full md:w-1/1 px-3 md:mb-0">
	  <label
		class="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
		for="grid-project"
	  >
		Project title
	  </label>
	  <input
		class="input-shade appearance-none block w-full text-gray-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
		id="grid-project"
		type="text"
		placeholder=""
		bind:value={projectTitle}
	  />
	</div>
	<!-- project description -->
	<div class="w-full md:w-1/1 px-3">
	  <label
		class="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
		for="grid-description"
	  >
		Project description
	  </label>
	  <input
		class="input-shade appearance-none block w-full text-gray-300 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
		id="grid-description"
		type="text"
		placeholder=""
		bind:value={projectDescription}
	  />
	</div>
	<!-- start date -->
	<div class="w-full md:w-1/2 px-3 md:mb-0 mt-2">
	  <label
		class="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
		for="grid-start-date"
	  >
		Start date
	  </label>
	  <input
		class="input-shade appearance-none block w-full text-gray-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
		id="grid-start-date"
		type="date"
		placeholder=""
		bind:value={startDate}
		on:input={validateDates}
	  />
	</div>
	<!-- end date -->
	<div class="w-full md:w-1/2 px-3 md:mb-0 mt-2">
	  <label
		class="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
		for="grid-end-date"
	  >
		End date
	  </label>
	  <input
		class="input-shade appearance-none block w-full text-gray-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
		id="grid-end-date"
		type="date"
		placeholder=""
		bind:value={endDate}
		on:input={validateDates}
	  />
	</div>
  
	<!-- Error Message -->
	{#if errorMessage}
	  <div class="text-xs text-red-500 mt-2">{errorMessage}</div>
	{/if}
  
	<!-- Success Message -->
	{#if showSuccessMessage}
	  <div class="text-xs text-green-500 mt-2">Saved successfully!</div>
	{/if}
  
	<!-- Project Entries -->
	<div class="w-full mt-4">
	  {#each projectEntries as { projectTitle, projectDescription, startDate, endDate }, index (index)}
		<div class="flex items-center space-x-2 mb-2" key={index}>
		  <span class="bg-gray-300 text-gray-700 px-2 py-1 rounded">
			{projectTitle} - {startDate} to {endDate}
		  </span>
		  <button on:click={($event) => { $event.preventDefault(); removeProject(index); }} class="remove-btn">Remove</button>
		</div>
	  {/each}
	</div>
  
	<!-- Submit Button -->
	<div class="flex justify-end w-full">
	  <button class="save-btn" on:click|preventDefault={handleProjectInformation}>
		<SaveButton>Save</SaveButton>
	  </button>
	</div>
  </div>
  