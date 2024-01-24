<script>
	import { createEventDispatcher } from 'svelte';
	import SaveButton from '../home/SaveButton.svelte';
	import { afterUpdate } from 'svelte';
	import { educationStore } from '../../lib/stores/educationStore.js';
	let educations = [];
	let institution = '';
	let course = '';
	let passoutYear = '';
	let courseName = '';
	let markScore = '';
	let showSuccessMessage = false;
	let errorMessage = '';
	let editingIndex = null;

	const dispatch = createEventDispatcher();

	function handleEducationInformation() {
		// Validate all fields
		if (
			!validateInstitution() ||
			!validateCourseName() ||
			!validateCourse() ||
			!validatePassoutYear() ||
			!validateMarkScore()
		) {
			return;
		}

		const formData = {
			institution,
			course,
			passoutYear,
			courseName,
			markScore
		};

		errorMessage = '';

		const apiUrl = '/api/education';
		const urlParts = window.location.href.split('/');
		const resumeId = urlParts.pop();

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
			.then((data) => {
				const insertedEducationId = data.educationResult.id;

				showSuccessMessage = true;

				setTimeout(() => {
					showSuccessMessage = false;
					showEducationForm = false; // Close the popup when success message is displayed
				}, 1000);

				if (editingIndex !== null) {
					// Editing an existing education
					educations[editingIndex] = { ...formData, id: insertedEducationId };
					educationStore.set(educations);

					editingIndex = null;
				} else {
					// Adding a new education
					educations = [...educations, { ...formData, id: insertedEducationId }];
					educationStore.set(educations);
				}

				// Clear the form after submission
				resetForm();
			})
			.catch((error) => {
				console.error('Error:', error);
				errorMessage = 'Error saving education information. Please try again.';
			});
	}

	afterUpdate(() => {
		if (showSuccessMessage) {
			setTimeout(() => {
				showSuccessMessage = false;
				showEducationForm = false; // Close the popup when success message is displayed
			}, 1000);
		}
	});

	// Function to validate institution
	function validateInstitution() {
		if (!institution.trim()) {
			errorMessage = 'Institution is required.';
			return false;
		} else {
			errorMessage = '';
			return true;
		}
	}

	// Function to validate course name
	function validateCourseName() {
		if (!courseName.trim()) {
			errorMessage = 'Stream (Course Name) is required.';
			return false;
		} else {
			errorMessage = '';
			return true;
		}
	}

	// Function to validate course
	function validateCourse() {
		if (!course.trim()) {
			errorMessage = 'Course is required.';
			return false;
		} else {
			errorMessage = '';
			return true;
		}
	}

	// Function to validate passout year (numeric validation)
	function validatePassoutYear() {
		if (!passoutYear.trim() || isNaN(Number(passoutYear))) {
			errorMessage = 'Please enter a valid passout year.';
			return false;
		} else {
			errorMessage = '';
			return true;
		}
	}

	// Function to validate mark score (numeric validation)
	function validateMarkScore() {
		if (!markScore.trim() || isNaN(Number(markScore))) {
			errorMessage = 'Please enter a valid mark score.';
			return false;
		} else {
			errorMessage = '';
			return true;
		}
	}

	// Function to remove education by index
	function removeEducation(index) {
		educations = educations.filter((_, i) => i !== index);
		educationStore.set(educations);
	}

	// Function to edit education by index
	function editEducation(index) {
		const education = educations[index];
		editingIndex = index;

		// Populate form fields with existing data for editing
		institution = education.institution;
		course = education.course;
		passoutYear = education.passoutYear;
		courseName = education.courseName;
		markScore = education.markScore;
		showEducationForm = true; // Show the education form when editing
	}

	// Function to reset the form
	function resetForm() {
		institution = '';
		course = '';
		passoutYear = '';
		courseName = '';
		markScore = '';
	}

	let showEducationForm = false; // New variable to control form visibility

	function showEducationFormHandler() {
		// Function to toggle the visibility of the education form
		showEducationForm = !showEducationForm;

		// Reset the form when it is displayed
		if (showEducationForm) {
			resetForm();
		} else {
			// Close the popup when adding an education
			showEducationForm = false;
		}
	}

	// Function to cancel and close the education form
	function cancelEducationForm() {
		showEducationForm = false;
		resetForm();
	}
</script>

<section class="">
	<!-- <button on:click={showEducationFormHandler}>Add Education</button> -->
</section>
<!-- {#if showEducationForm} -->
<div class="overlay">
	<div class="modal">
		<div class="flex flex-wrap">
			<!-- Institution -->
			<div class="w-full md:w-1/1 px-3 md:mb-0">
				<label
					class="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
					for="grid-institution"
				>
					Institution
				</label>
				<input
					class="input-shade appearance-none block w-full text-gray-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
					id="grid-institution"
					type="text"
					placeholder=""
					bind:value={institution}
				/>
			</div>
			<!-- course name -->
			<div class="w-full md:w-1/2 px-3 md:mb-0">
				<label
					class="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
					for="grid-course-name"
				>
					Stream
				</label>
				<input
					class="input-shade appearance-none block w-full text-gray-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
					id="grid-course-name"
					type="text"
					placeholder=""
					bind:value={courseName}
				/>
			</div>
			<!-- course -->
			<div class="w-full md:w-1/2 px-3">
				<label
					class="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
					for="grid-course"
				>
					Course
				</label>
				<input
					class="input-shade appearance-none block w-full text-gray-300 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
					id="grid-Course"
					type="text"
					placeholder=""
					bind:value={course}
				/>
			</div>
			<!-- passout year with real-time validation -->
			<div class="w-full md:w-1/1 px-3 md:mb-0">
				<label
					class="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
					for="grid-passout"
				>
					Passout Year
				</label>
				<input
					class="input-shade appearance-none block w-full text-gray-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
					id="grid-passout"
					type="text"
					placeholder=""
					bind:value={passoutYear}
					on:input={validatePassoutYear}
				/>
			</div>

			<!-- mark scored with real-time validation -->
			<div class="w-full md:w-1/1 px-3 md:mb-0">
				<label
					class="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
					for="grid-mark-score"
				>
					Mark Scored (%)
				</label>
				<input
					class="input-shade appearance-none block w-full text-gray-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
					id="grid-mark-score"
					type="text"
					placeholder=""
					bind:value={markScore}
					on:input={validateMarkScore}
				/>
			</div>
			{#if showSuccessMessage}
				<div class="text-xs text-green-500 mt-2">Saved successfully!</div>
			{/if}

			<!-- Error Message -->
			{#if errorMessage}
				<div class="text-xs text-red-500 mt-2">{errorMessage}</div>
			{/if}
			<!-- Cancel and Submit Buttons -->
			<div class="flex justify-end w-full">
				<!-- <button class="cancel-btn" on:click|preventDefault={cancelEducationForm}> Cancel </button> -->
				<button class="save-btn" on:click|preventDefault={handleEducationInformation}>
					<SaveButton>Save</SaveButton>
				</button>
			</div>
		</div>
	</div>
</div>
<!-- {/if} -->

<!-- Display added education details -->
<div class="w-full mt-4 grid grid-cols-2 gap-5">
	{#each educations as education, index (education.id)}
		<div class=" f bg-gray-500 rounded-lg p-2 text-white" key={index}>
			<!-- Success Message -->
			<section class="flex flex-row">
				<!-- Display education details -->
				<div class="w-full px-3 md:mb-0 ">
					<span class="flex justify-between w-full items-start overflow-hidden">
						<p>Institution:</p>
						<p class="flex items-start justify-start ">{education.institution}</p></span
					>
					<span class="flex justify-between w-full items-start">
						<p>Course:</p>
						<p class="flex items-start justify-start">{education.course}</p></span
					>
					<span class="flex justify-between w-full items-start">
						<p>Passout Year:</p>
						<p class="flex items-start justify-start">{education.passoutYear}</p></span
					>
					<span class="flex justify-between w-full items-start">
						<p>Course Name:</p>
						<p class="flex items-start justify-start">{education.courseName}</p></span
					>
					<span class="flex justify-between w-full items-start">
						<p>Mark Scored:</p>
						<p class="flex items-start justify-start">{education.markScore}</p></span
					>
				</div>
				<div class="flex h-full items-start justify-end align-top">
					<!-- Edit and Remove Buttons -->
					<button on:click|preventDefault={() => editEducation(index)} class="edit-btn">
						<i class="text-xs fas fa-pencil-alt text-green-500"></i>
					</button>&nbsp;
					<button on:click|preventDefault={() => removeEducation(index)} class="remove-btn">
						<i class="text-red-500 fa-solid fa-xmark"></i>
					</button>
				</div>
			</section>
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
