<script>
	import { createEventDispatcher } from 'svelte';
	import SaveButton from '../home/SaveButton.svelte';
	import { afterUpdate } from 'svelte';
	import { skillsStore } from '../../lib/stores/skillsStore.js';

	let skills = [];
	let newSkill = '';
	let showSuccessMessage = false;
	let errorMessage = '';
	let editingIndex = null;
	let requestBody = {};
	let inputField; // Reference to the input field
	const dispatch = createEventDispatcher();
	let isFormVisible = false; 
	let isEditMode = false; 

	function resetForm() {
		newSkill = '';
		errorMessage = '';
		editingIndex = null;
		isEditMode = false;
	}

	function handleSkillInformation() {
		// Validate new skill input
		if (!newSkill.trim()) {
			errorMessage = 'Please enter a valid skill.';
			return;
		}

		// Check if the skill already exists
		if (skills.some((skillObj) => skillObj.skill === newSkill)) {
			errorMessage = 'This skill already exists.';
			return;
		}

		if (editingIndex !== null) {
			// Editing an existing skill
			skills[editingIndex].skill = newSkill;
			editingIndex = null;
			isEditMode = false;
		} else {
			// Adding a new skill
			saveSkillAPI(newSkill);
			skillsStore.set(skills);
		}

		// Reset input field and error message
		resetForm();

		// Show success message
		showSuccessMessage = true;

		// Hide success message after 1000ms
		setTimeout(() => {
			showSuccessMessage = false;
			// Hide the form after success
		}, 1000);
		isFormVisible = false;
	}

	function removeSkill(index) {
		skills.splice(index, 1);
		skills = [...skills];
		skillsStore.set(skills);
		// Ensure reactivity by creating a new array
	}

	function saveSkillAPI(skill) {
		const apiUrl = '/api/skill';
		const urlParts = window.location.href.split('/');
		const resumeId = urlParts.pop();

		let requestOptions = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				skill,
				resumeId,
				skillId: requestBody.skillId // Include skillId when editing
			})
		};

		// Adjust request method for editing
		if (requestBody.skillId) {
			requestOptions.method = 'PUT'; // Assuming your server supports the PUT method for updates
		}

		fetch(apiUrl, requestOptions)
			.then((response) => response.json())
			.then((data) => {
				console.log('API Response:', data);

				const insertedSkillId = data.skillResult.id;
				console.log('Inserted skill ID:', insertedSkillId);

				if (requestBody.skillId) {
					// If skillId is present, it means we are updating an existing skill
					const updatedSkills = skills.map((s) =>
						s.id === requestBody.skillId ? { id: s.id, skill } : s
					);
					skills = updatedSkills;
				} else {
					// If skillId is not present, it means we are adding a new skill
					skills = [...skills, { id: insertedSkillId, skill }];
				}

				// Reset requestBody.skillId after update or insert
				requestBody.skillId = null;

				// Dispatch an event
				dispatch('skillData', insertedSkillId);
			})
			.catch((error) => console.error('Error:', error));
	}

	afterUpdate(() => {
		if (showSuccessMessage) {
			setTimeout(() => {
				showSuccessMessage = false;
			}, 1000);
		}
	});
</script>

<section class="flex w-full">
	{#if !isFormVisible}
		<button
			on:click={() => {
				isFormVisible = true;
				resetForm();
				isEditMode = false;
				// Reset edit mode when adding a new Skill
			}}
			class="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-800 transition duration-150 ease-in-out"
		>
			<i class="mr-2 fas fa-plus"></i> Add Skill
		</button>
	{/if}
</section>

{#if isFormVisible}
	<div class="flex flex-wrap">
		<!-- Skill -->
		<section class="w-full">
			<div class="">
				<!-- Skill -->
				<div class="w-full flex">
					<input
						class="input-shade appearance-none block w-full text-gray-900 rounded mb-2 focus:outline-none focus:bg-white"
						type="text"
						placeholder="Python, Django, HTML"
						bind:value={newSkill}
						bind:this={inputField}
					/>
				</div>
				<!-- Error Message -->
				{#if errorMessage}
					<div class="text-xs text-red-500 mt-2">{errorMessage}</div>
				{/if}

				
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
						on:click|preventDefault={handleSkillInformation}
					>
						{#if isEditMode}Save{:else}Add{/if}
					</button>
				</div>
			</div>
		</section>
	</div>
{/if}
<!-- Success Message -->
{#if showSuccessMessage}
	<div class="text-xs text-green-500 mt-2">Saved successfully!</div>
{/if}
<!-- Skills Entries -->
<div class="w-full mt-4">
	{#each skills as { id, skill }, index (id)}
		<div class="flex items-center space-x-2 mb-2" key={id}>
			<section class="bg-blue-300/20 shadow-lg px-2 rounded-full flex justify-between min-w-32">
				<span class="text-sm text-gray-700 px-2 py-1 rounded">{skill}</span>
				<section class="flex justify-between gap-2">
					<button
						on:click={() => {
							editingIndex = index;
							newSkill = skill;
							// Set skillId when editing
							requestBody.skillId = id;

							// Initialize inputField if not already set
							if (!inputField) {
								inputField = document.createElement('input');
							}

							// Set focus on the input field
							inputField.focus();

							// Ensure the form remains visible during editing
							isFormVisible = true;
						}}
						class="edit-btn text-xs"
					>
						<i class="text-xs fas fa-pencil-alt text-green-500"></i>
					</button>
					<button on:click={() => removeSkill(index)} class="remove-btn text-xs pr-2">
						<i class="text-red-500 fa-solid fa-xmark"></i>
					</button>
				</section>
			</section>
		</div>
	{/each}
</div>
