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
	let showEducationForm = false;

	const dispatch = createEventDispatcher();

	let institutionError = '';
	let courseNameError = '';
	let courseError = '';
	let passoutYearError = '';
	let markScoreError = '';

	function handleEducationInformation() {
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
					showEducationForm = false;
				}, 1000);

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

	afterUpdate(() => {
		if (showSuccessMessage) {
			setTimeout(() => {
				showSuccessMessage = false;
			}, 1000);
			showEducationForm = false;
		}
	});

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

	function removeEducation(index) {
		educations = educations.filter((_, i) => i !== index);
		educationStore.set(educations);
	}

	function editEducation(index) {
		const education = educations[index];
		editingIndex = index;

		institution = education.institution;
		course = education.course;
		passoutYear = education.passoutYear;
		courseName = education.courseName;
		markScore = education.markScore;
		showEducationForm = true;
	}

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

	function showEducationFormHandler() {
		showEducationForm = !showEducationForm;

		if (showEducationForm) {
			resetForm();
		} else {
			showEducationForm = false;
		}
	}

	function cancelEducationForm() {
		showEducationForm = false;
		resetForm();
	}
</script>

{#if !showEducationForm}
	<section class="flex w-full">
		<button
			on:click={showEducationFormHandler}
			class="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-800 transition duration-150 ease-in-out"
		>
			<i class="mr-2 fas fa-plus"></i> Add Education
		</button>
	</section>
{/if}

{#if showEducationForm}
	<div class="overlay">
		<div class="modal">
			<div class="flex flex-wrap">
				<div class="w-full md:w-1/1 px-3 md:mb-0">
					<label
						class="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
						for="grid-institution"
					>
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
				<div class="w-full md:w-1/2 px-3 md:mb-0">
					<label
						class="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
						for="grid-course-name"
					>
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
				<div class="w-full md:w-1/2 px-3">
					<label
						class="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
						for="grid-Course"
					>
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
				<div class="w-full md:w-1/1 px-3 md:mb-0">
					<label
						class="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
						for="grid-passout"
					>
						Passout Year
					</label>
					<input
						class="input-shade appearance-none block w-full text-gray-600 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
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
				<div class="w-full md:w-1/1 px-3 md:mb-0">
					<label
						class="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
						for="grid-mark-score"
					>
						Mark Scored (%)
					</label>
					<input
						class="input-shade appearance-none block w-full text-gray-600 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
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
				<div class="flex justify-end w-full mr-4 mt-5">
					<button 
						class="cancel-btn px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-gray-500 hover:bg-gray-400 focus:outline-none focus:border-gray-700 focus:shadow-outline-green active:bg-gray-800 transition duration-150 ease-in-out mr-2"
						on:click={cancelEducationForm}
					>
						<span>Cancel</span>
					</button>
					<button 
						class="save-btn px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-blue-500 hover:bg-blue-400 focus:outline-none focus:border-blue-700 focus:shadow-outline-green active:bg-blue-800 transition duration-150 ease-in-out"
						on:click|preventDefault={handleEducationInformation}
					>
						<span>{editingIndex !== null ? 'Save' : 'Add'}</span>
					</button>
				</div>

				
			</div>
		</div>
	</div>
{/if}
{#if showSuccessMessage}
	<div class="text-xs text-green-500 mt-2">Saved successfully!</div>
{/if}
<div class="w-full mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
    {#each educations as education, index (education.id)}
        <div class="bg-blue-200/20 rounded-lg p-4 text-white relative shadow-lg" key={index}>
            <div class="absolute top-2 right-2">
                <button on:click|preventDefault={() => editEducation(index)} class="edit-btn mr-2">
                    <i class="text-xs fas fa-pencil-alt text-green-500"></i>
                </button>
                <button on:click|preventDefault={() => removeEducation(index)} class="remove-btn">
                    <i class="text-red-500 fa-solid fa-xmark"></i>
                </button>
            </div>
            <section class="flex flex-col">
                <div class="mb-4">
                    <span class="text-gray-900">Institution:</span>
                    <p class="text-gray-600">{education.institution}</p>
                </div>
                <div class="mb-4">
                    <span class="text-gray-900">Course:</span>
                    <p class="text-gray-600">{education.course}</p>
                </div>
                <div class="mb-4">
                    <span class="text-gray-900">Passout Year:</span>
                    <p class="text-gray-600">{education.passoutYear}</p>
                </div>
                <div class="mb-4">
                    <span class="text-gray-900">Course Name:</span>
                    <p class="text-gray-600">{education.courseName}</p>
                </div>
                <div class="mb-4">
                    <span class="text-gray-900">Mark Scored:</span>
                    <p class="text-gray-600">{education.markScore}</p>
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
