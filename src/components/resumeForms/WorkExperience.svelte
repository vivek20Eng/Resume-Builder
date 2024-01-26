<script>
	import { createEventDispatcher } from 'svelte';
	import { afterUpdate } from 'svelte';
	import { workExperienceStore } from '../../lib/stores/workExperienceStore.js';
  
	let experienceEntries = [];
	let company = '';
	let designation = '';
	let joiningDate = '';
	let endDate = '';
	let totalWorkExperience = '';
	let showSuccessMessage = false;
	let errorMessage = '';
	let isEditMode = false;
	let editIndex = -1; // Track the index of the experience being edited
  
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
  
	  // If in edit mode, update the entry instead of adding a new one
	  if (isEditMode) {
		// Update the entry at the specified index
		experienceEntries[editIndex] = { ...formData };
	  } else {
		// Add the new experience entry to the array
		experienceEntries = [...experienceEntries, { ...formData }];
	  }
  
	  workExperienceStore.set(experienceEntries);
  
	  // Reset input fields
	  resetForm();
  
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
	  workExperienceStore.set(experienceEntries);
	}
  
	// Function to edit an experience entry
	function editExperience(index) {
	  isEditMode = true;
	  editIndex = index;
  
	  // Set form fields with the values of the selected experience
	  const selectedExperience = experienceEntries[index];
	  company = selectedExperience.company;
	  designation = selectedExperience.designation;
	  joiningDate = selectedExperience.joiningDate;
	  endDate = selectedExperience.endDate;
	  totalWorkExperience = selectedExperience.totalWorkExperience;
  
	  // Reset error messages
	  errorMessage = '';
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
  
	// Add the resetForm function
	function resetForm() {
	  company = '';
	  designation = '';
	  joiningDate = '';
	  endDate = '';
	  totalWorkExperience = '';
	  errorMessage = '';
	  isEditMode = false;
	  editIndex = -1; // Reset editIndex when adding a new Work experience
	}
  </script>
  
  
  
	<div class="flex flex-wrap">
	  <!-- work experience -->
	  <div class="w-full md:w-1/1  md:mb-0">
		<label
		  class="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
		  for="grid-institution"
		>
		  Company
		</label>
		<input
		  class="input-shade appearance-none block w-full text-gray-600 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
		  id="grid-Company"
		  type="text"
		  placeholder=""
		  bind:value={company}
		/>
		
	  </div>
	  <!-- designation -->
	  <div class="w-full md:w-1/1  md:mb-0">
		<label
		  class="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
		  for="grid-designation"
		>
		  Designation
		</label>
		<input
		  class="input-shade appearance-none block w-full text-gray-600 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
		  id="grid-designation"
		  type="text"
		  placeholder=""
		  bind:value={designation}
		/>
		
	  </div>
  
	  <!-- joining date -->
	  <div class="w-full md:w-1/2  md:mb-0 mt-2 pr-2">
		<label
		  class="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
		  for="grid-joining-date"
		>
		  Joining Date
		</label>
		<input
		  class="input-shade appearance-none block w-full text-gray-600 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
		  id="grid-joining-date"
		  type="date"
		  placeholder=""
		  bind:value={joiningDate}
		  on:change={validateDates}
		/>
		<!-- Error Message -->
		{#if errorMessage && !joiningDate}
		  <div class="text-xs text-red-500 mt-2 ">{errorMessage}</div>
		{/if}
	  </div>
	  <!-- end date -->
	  <div class="w-full md:w-1/2  md:mb-0 mt-2 pl-2">
		<label
		  class="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
		  for="grid-end-date"
		>
		  End Date
		</label>
		<input
		  class="input-shade appearance-none block w-full text-gray-600 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
		  id="grid-end-date"
		  type="date"
		  placeholder=""
		  bind:value={endDate}
		  on:change={validateDates}
		/>
		
		<!-- Error Message -->
		{#if errorMessage }
		  <div class="text-xs text-red-500 mt-2">{errorMessage}</div>
		{/if}
	  </div>
	  <!-- total work experience -->
	  <div class="w-full md:w-1/1  md:mb-0">
		<label
		  class="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
		  for="grid-total-work-experience"
		>
		  Total Work Experience
		</label>
		<input maxlength="2"
		  class="input-shade appearance-none block w-full text-gray-600 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
		  id="grid-total-work-experience"
		  type="text"
		  placeholder=""
		  bind:value={totalWorkExperience}
		/>
		
	  </div>
	  
  
	  <!-- Submit and Cancel Buttons -->
	  <div class="flex justify-between w-full mt-5 ">
		<div>
			
			  <!-- Success Message -->
{#if showSuccessMessage}
<div class="text-xs text-green-500 mt-2">Saved successfully!</div>
{/if}
		</div>
		<section>
		<button
		  class="cancel-btn px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-gray-500 hover:bg-gray-400 focus:outline-none focus:border-gray-700 focus:shadow-outline-green active:bg-gray-800 transition duration-150 ease-in-out mr-2"
		  on:click={() => {
			resetForm();
		  }}
		>
		  <span>Cancel</span>
		</button>
		<button
		  class="save-btn px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:border-blue-700 focus:shadow-outline-green active:bg-blue-800 transition duration-150 ease-in-out"
		  on:click|preventDefault={handleExperienceInformation}
		>
		  {#if isEditMode}Save{:else}Add{/if}
		</button>
	</section>
	  </div>
	</div>

<!-- Experience Entries -->
<div class="w-full mt-4">
	{#each experienceEntries as { company, designation, joiningDate, endDate, totalWorkExperience }, index (index)}
	  <div class="bg-blue-200/20 shadow-md rounded-md p-4 mb-4 flex items-start justify-between" key={index}>
		<div>
		  <p class="text-lg font-semibold">{company}</p>
		  <p class="text-gray-600">{designation}</p>
		  <p class="text-gray-600">{joiningDate} to {endDate}</p>
		  <p class="text-gray-600">Total Experience: {totalWorkExperience}</p>
		</div>
		<div class="flex items-center space-x-2">
		  <button on:click={() => editExperience(index)} class="edit-btn">
			<i class="text-xs fas fa-pencil-alt text-green-500"></i>
		  </button>
		  <button on:click={() => removeExperience(index)} class="remove-btn">
			<i class="text-red-500 fa-solid fa-trash text-xs"></i>
		  </button>
		</div>
	  </div>
	{/each}
  </div>
  