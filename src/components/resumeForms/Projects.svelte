<script>
	import { createEventDispatcher } from 'svelte';
	import { afterUpdate } from 'svelte';
	import { projectsStore } from '../../lib/stores/projectsStore.js';
  
	let projectEntries = [];
	let projectTitle = '';
	let projectDescription = '';
	let startDate = '';
	let endDate = '';
	let showSuccessMessage = false;
	let errorMessages = {
		projectTitle: '',
		startDate: '',
		endDate: ''
	};
	let isFormVisible = false;
	let isEditMode = false;
	let editIndex = -1;
  
	const dispatch = createEventDispatcher();
  
	function validateProjectTitle() {
	  errorMessages.projectTitle = !projectTitle ? 'Please enter a project title.' : '';
	  return !errorMessages.projectTitle;
	}
  
	function validateDates() {
	  if (!startDate || !endDate) {
		errorMessages.startDate = 'Please enter both start date and end date.';
		return false;
	  }
  
	  const startTimestamp = new Date(startDate).getTime();
	  const endTimestamp = new Date(endDate).getTime();
  
	  if (endTimestamp < startTimestamp) {
		errorMessages.startDate = 'End date cannot be less than start date.';
		return false;
	  }
  
	  errorMessages.startDate = '';
	  return true;
	}
  
	function handleProjectInformation() {
	  if (validateProjectTitle() && validateDates()) {
		if (isEditMode) {
		  projectEntries[editIndex] = { projectTitle, projectDescription, startDate, endDate };
		  isEditMode = false;
		} else {
		  projectEntries = [...projectEntries, { projectTitle, projectDescription, startDate, endDate }];
		}
  
		projectsStore.set(projectEntries);
  
		resetForm();
  
		showSuccessMessage = true;
  
		setTimeout(() => {
		  showSuccessMessage = false;
		}, 1000);
  
		saveProjectInformation();
		isFormVisible = false;
	  }
	}
  
	function resetForm() {
	  projectTitle = '';
	  projectDescription = '';
	  startDate = '';
	  endDate = '';
	  errorMessages = {
		projectTitle: '',
		startDate: '',
		endDate: ''
	  };
	}
  
	function removeProject(index) {
  projectEntries.splice(index, 1);
  projectsStore.set(projectEntries); 
  // Update the store after modifying projectEntries
  projectEntries = [...projectEntries]; 
  // Use a reactive statement to trigger updates
}

	
  
	function editProject(index) {
	  const selectedProject = projectEntries[index];
	  projectTitle = selectedProject.projectTitle;
	  projectDescription = selectedProject.projectDescription;
	  startDate = selectedProject.startDate;
	  endDate = selectedProject.endDate;
  
	  isEditMode = true;
	  isFormVisible = true; 
	  // Show the form when editing
	  editIndex = index;
	}
  
	afterUpdate(() => {
	  if (showSuccessMessage) {
		setTimeout(() => {
		  showSuccessMessage = false;
		}, 1000);
	  }
	});
  
	function saveProjectInformation() {
	  const formData = {
		projectEntries
	  };
  
	  const apiUrl = '/api/project';
	  const resumeId = window.location.href.split('/').pop();
  
	  formData.resumeId = resumeId;
  
	  const requestOptions = {
		method: 'POST',
		headers: {
		  'Content-Type': 'application/json'
		},
		body: JSON.stringify(formData)
	  };
  
	  fetch(apiUrl, requestOptions)
		.then((response) => response.json())
		.then((data) => console.log('API Response:', data))
		.catch((error) => console.error('Error:', error));
	}
</script>
  
<section class="flex w-full">
  {#if !isFormVisible}
    <button
      on:click={() => {
        isFormVisible = true;
        resetForm();
        isEditMode = false; 
		// Reset edit mode when adding a new project
      }}
      class="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-800 transition duration-150 ease-in-out"
    >
      <i class="mr-2 fas fa-plus"></i> {#if isEditMode}Edit Project{:else}Add Project{/if}
    </button>
  {/if}
</section>

{#if isFormVisible}
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
      <!-- Error Message for Project Title -->
      {#if errorMessages.projectTitle}
        <div class="text-xs text-red-500 mt-2 ">{errorMessages.projectTitle}</div>
      {/if}
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
      <!-- Error Message for Start Date -->
      {#if errorMessages.startDate}
        <div class="text-xs text-red-500 mt-2">{errorMessages.startDate}</div>
      {/if}
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
      <!-- Error Message for End Date -->
      {#if errorMessages.startDate}
        <div class="text-xs text-red-500 mt-2 ">{errorMessages.endDate}</div>
      {/if}
    </div>

    <!-- Submit and Cancel Buttons -->
    <div class="flex justify-end w-full mt-5 mr-3">
      <button
        class="cancel-btn px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-gray-500 hover:bg-gray-400 focus:outline-none focus:border-gray-700 focus:shadow-outline-green active:bg-gray-800 transition duration-150 ease-in-out mr-2"
        on:click={() => {
          isFormVisible = false;
          resetForm();
        }}
      >
        <span>Cancel</span>
      </button>
      <button
        class="save-btn px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-blue-500 hover:bg-blue-400 focus:outline-none focus:border-blue-700 focus:shadow-outline-green active:bg-blue-800 transition duration-150 ease-in-out"
        on:click|preventDefault={handleProjectInformation}
      >
        {#if isEditMode}Save{:else}Add{/if}
      </button>
    </div>
  </div>
{/if}

<!-- Success Message -->
{#if showSuccessMessage}
  <div class="text-xs text-green-500 mt-2">Saved successfully!</div>
{/if}

<!-- Project Entries -->
<div class="w-full mt-4">
  {#each projectEntries as { projectTitle, startDate, endDate }, index (index)}
    <div class="bg-gray-200 p-4 rounded mb-4 flex items-center justify-between" key={index}>
      <div>
        <p class="text-lg font-semibold">{projectTitle}</p>
        <p class="text-gray-600">{startDate} to {endDate}</p>
      </div>
      <div class="flex items-center space-x-2">
        <button on:click={() => editProject(index)} class="edit-btn text-green-500">
          <i class="text-xs fas fa-pencil-alt"></i>
        </button>
        <button on:click={() => removeProject(index)} class="remove-btn text-red-500">
          <i class="text-xs fas fa-trash"></i>
        </button>
      </div>
    </div>
  {/each}
</div>
