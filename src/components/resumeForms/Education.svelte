<script>
	import { createEventDispatcher } from 'svelte';
	import { afterUpdate } from 'svelte';
	import { educationStore } from '../../lib/stores/educationStore.js';
  
	// Initialize variables
	let educations = [];
	let institution = '';
	let course = '';
	let passoutYear = '';
	let courseName = '';
	let markScore = '';
	let showSuccessMessage = false;
	let errorMessage = '';
	let editingIndex = null;
  
	// Event dispatcher for communication between components
	const dispatch = createEventDispatcher();
  
	// Validation error messages
	let institutionError = '';
	let courseNameError = '';
	let courseError = '';
	let passoutYearError = '';
	let markScoreError = '';
  
	// Handle saving or updating education information
	function handleEducationInformation() {
	  // Validate input fields
	  if (
		!validateInstitution() ||
		!validateCourseName() ||
		!validateCourse() ||
		!validatePassoutYear() ||
		!validateMarkScore()
	  ) {
		return;
	  }
  
	  // Construct form data
	  const formData = {
		institution,
		course,
		passoutYear,
		courseName,
		markScore
	  };
  
	  errorMessage = ''; // Reset error message
  
	  // API URL and resume ID
	  const apiUrl = '/api/education';
	  const urlParts = window.location.href.split('/');
	  const resumeId = urlParts.pop();
  
	  formData.resumeId = resumeId;
  
	  // Request options
	  const requestOptions = {
		method: 'POST',
		headers: {
		  'Content-Type': 'application/json'
		},
		body: JSON.stringify(formData)
	  };
  
	  // Send a fetch request
	  fetch(apiUrl, requestOptions)
		.then((response) => response.json())
		.then((data) => {
		  const insertedEducationId = data.educationResult.id;
  
		  showSuccessMessage = true;
  
		  // Reset form after a delay
		  setTimeout(() => {
			showSuccessMessage = false;
		  }, 1000);
		  dispatch('educationData', insertedEducationId);

		  // Update education data in the store
		  if (editingIndex !== null) {
			educations[editingIndex] = { ...formData, id: insertedEducationId };
			educationStore.set(educations);
  
			editingIndex = null;
		  } else {
			educations = [...educations, { ...formData, id: insertedEducationId }];
			educationStore.set(educations);
		  }
  
		  resetForm();
		})
		.catch((error) => {
		  console.error('Error:', error);
		  errorMessage = 'Error saving education information. Please try again.';
		});
	}
  
	// After update lifecycle hook
	afterUpdate(() => {
	  // Hide success message after a delay
	  if (showSuccessMessage) {
		setTimeout(() => {
		  showSuccessMessage = false;
		}, 1000);
	  }
	});
  
	// Validation functions
	function validateInstitution() {
	  if (!institution.trim()) {
		institutionError = 'Institution is required.';
		return false;
	  } else {
		institutionError = '';
		return true;
	  }
	}
  
	function validateCourseName() {
	  if (!courseName.trim()) {
		courseNameError = 'Stream (Course Name) is required.';
		return false;
	  } else {
		courseNameError = '';
		return true;
	  }
	}
  
	function validateCourse() {
	  if (!course.trim()) {
		courseError = 'Course is required.';
		return false;
	  } else {
		courseError = '';
		return true;
	  }
	}
  
	function validatePassoutYear() {
	  if (!passoutYear.trim() || isNaN(Number(passoutYear))) {
		passoutYearError = 'Please enter a valid passout year.';
		return false;
	  } else {
		passoutYearError = '';
		return true;
	  }
	}
  
	function validateMarkScore() {
	  if (!markScore.trim() || isNaN(Number(markScore))) {
		markScoreError = 'Please enter a valid mark score.';
		return false;
	  } else {
		markScoreError = '';
		return true;
	  }
	}
  
	// Remove education entry
	function removeEducation(index) {
	  educations = educations.filter((_, i) => i !== index);
	  educationStore.set(educations);
	}
  
	// Edit education entry
	function editEducation(index) {
	  const education = educations[index];
	  editingIndex = index;
  
	  // Set form values for editing
	  institution = education.institution;
	  course = education.course;
	  passoutYear = education.passoutYear;
	  courseName = education.courseName;
	  markScore = education.markScore;
	}
  
	// Reset form values
	function resetForm() {
	  institution = '';
	  course = '';
	  passoutYear = '';
	  courseName = '';
	  markScore = '';
	  institutionError = '';
	  courseNameError = '';
	  courseError = '';
	  passoutYearError = '';
	  markScoreError = '';
	}
  
	// Cancel education form
	function cancelEducationForm() {
	  resetForm();
	}
  </script>
  
  <!-- Modal for adding/editing education information -->
  <div class="overlay">
	<div class="modal">
	  <!-- Form for adding/editing education -->
	  <div class="flex flex-wrap">
		<!-- Institution input field -->
		<div class="w-full md:w-1/1  md:mb-0">
		  <label class="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2" for="grid-institution">
			Institution
		  </label>
		  <input
			class="input-shade appearance-none block w-full text-gray-600 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
			id="grid-institution"
			type="text"
			placeholder=""
			bind:value={institution}
			on:input={() => (institutionError = '')}
		  />
		  {#if institutionError}
			<p class="text-xs text-red-500 mt-1">{institutionError}</p>
		  {/if}
		</div>
  
		<!-- Course Name input field -->
		<div class="w-full md:w-1/2  md:mb-0 pr-2">
		  <label class="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2" for="grid-course-name">
			Stream
		  </label>
		  <input
			class="input-shade appearance-none block w-full text-gray-600 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
			id="grid-course-name"
			type="text"
			placeholder=""
			bind:value={courseName}
			on:input={() => (courseNameError = '')}
		  />
		  {#if courseNameError}
			<p class="text-xs text-red-500 mt-1">{courseNameError}</p>
		  {/if}
		</div>
  
		<!-- Course input field -->
		<div class="w-full md:w-1/2 pl-2">
		  <label class="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2" for="grid-Course">
			Course
		  </label>
		  <input
			class="input-shade appearance-none block w-full text-gray-600 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
			id="grid-Course"
			type="text"
			placeholder=""
			bind:value={course}
			on:input={() => (courseError = '')}
		  />
		  {#if courseError}
			<p class="text-xs text-red-500 mt-1">{courseError}</p>
		  {/if}
		</div>
  
		<!-- Passout Year input field -->
		<div class="w-full md:w-1/1  md:mb-0">
		  <label class="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2" for="grid-passout">
			Passout Year
		  </label>
		  <input
			class="input-shade appearance-none block w-full text-gray-600 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"maxlength="4"
			id="grid-passout"
			type="text"
			placeholder=""
			bind:value={passoutYear}
			on:input={() => (passoutYearError = '')}
		  />
		  {#if passoutYearError}
			<p class="text-xs text-red-500 mt-1">{passoutYearError}</p>
		  {/if}
		</div>
  
		<!-- Mark Score input field -->
		<div class="w-full md:w-1/1  md:mb-0">
		  <label class="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2" for="grid-mark-score">
			Mark Scored (%)
		  </label>
		  <input
			class="input-shade appearance-none block w-full text-gray-600 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"maxlength="3"
			id="grid-mark-score"
			type="text"
			placeholder=""
			bind:value={markScore}
			on:input={() => (markScoreError = '')}
		  />
		  {#if markScoreError}
			<p class="text-xs text-red-500 mt-1">{markScoreError}</p>
		  {/if}
		</div>
  
		{#if errorMessage}
		  <div class="text-xs text-red-500 mt-2">{errorMessage}</div>
		{/if}
  
		<!-- Buttons for Cancel and Save -->
		<div class="flex justify-between w-full mt-5">
			<div>
			{#if showSuccessMessage}
	<div class="text-xs text-green-500 mt-2">Saved successfully!</div>
{/if}
</div>
<section>
		  <button
			class="cancel-btn px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-gray-500 hover:bg-gray-400 focus:outline-none focus:border-gray-700 focus:shadow-outline-green active:bg-gray-800 transition duration-150 ease-in-out mr-2"
			on:click={cancelEducationForm}
		  >
			<span>Cancel</span>
		  </button>
		  <button
			class="save-btn px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:border-blue-700 focus:shadow-outline-green active:bg-blue-800 transition duration-150 ease-in-out"
			on:click|preventDefault={handleEducationInformation}
		  >
			<span>{editingIndex !== null ? 'Save' : 'Add'}</span>
		  </button>
		</section>
		</div>
	  </div>
	</div>
  </div>

<div class="flex flex-col gap-4 mt-8">
    {#each educations as education, index (education.id)}
        <div class="bg-blue-300/20 border-gray-100/20 rounded-lg p-4 text-white relative shadow-lg hover:shadow-xl transition duration-300 w-full ">
            <div class="absolute top-2 right-2 flex space-x-2">
                <button on:click|preventDefault={() => editEducation(index)} class="edit-btn">
                    <i class="text-xs fas fa-pencil-alt text-green-500" title="Edit"></i>
                </button>
                <button on:click|preventDefault={() => removeEducation(index)} class="remove-btn">
                    <i class="text-red-500 fas fa-trash text-xs" title="Remove"></i>
                </button>
            </div>
            <div class="flex flex-col gap-2">
                <div class="flex flex-row items-center gap-2">
                    <span class="font-semibold text-gray-900">Institution:</span>
                    <p class="text-gray-600">{education.institution}</p>
                </div>
                <div class="flex flex-row items-center gap-2">
                    <span class="font-semibold text-gray-900">Course:</span>
                    <p class="text-gray-600">{education.course}</p>
                </div>
                <div class="flex flex-row items-center gap-2">
                    <span class="font-semibold text-gray-900">Passout Year:</span>
                    <p class="text-gray-600">{education.passoutYear}</p>
                </div>
                <div class="flex flex-row items-center gap-2">
                    <span class="font-semibold text-gray-900">Course Name:</span>
                    <p class="text-gray-600">{education.courseName}</p>
                </div>
                <div class="flex flex-row items-center gap-2">
                    <span class="font-semibold text-gray-900">Mark Scored:</span>
                    <p class="text-gray-600">{education.markScore}</p>
                </div>
            </div>
        </div>
    {/each}
</div>




<!-- pop up model -->
<!-- <style>
	
	.modal {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background-color: white;
		padding: 20px;
		z-index: 1000;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
	}

	.overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		z-index: 999;
	}
</style> -->
