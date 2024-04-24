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
			requestOptions.method = 'PUT'; 
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
<style>
	input::placeholder {
	color: #808080; 
  }
</style>


	<div class="flex flex-wrap">
		<!-- Skill -->
		<section class="w-full">
			<div class="">
				<label
				class="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
				for="grid-skill"
			  >
				Skill
			  </label>
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
				<div class="flex justify-between w-full mt-5">
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
						on:click|preventDefault={handleSkillInformation}
					>
						{#if isEditMode}Save{:else}Add{/if}
					</button>
				</section>
				</div>
			</div>
		</section>
	</div>

<!-- Skills Entries Grid -->
<div class="grid grid-cols-3 gap-4 mt-4">
	{#each skills as { id, skill }, index (id)}
	  <div class="bg-blue-300/20 shadow-md p-2 rounded transition-all duration-300 hover:shadow-lg flex flex-row justify-between">
		<span class="text-sm text-gray-700 block mb-1">{skill}</span>
		<section class="flex justify-between gap-2 items-start align-middle">
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
			}}
			class="edit-btn text-xs transition-all duration-300 transform hover:scale-110"
		  >
			<i class="text-xs fas fa-pencil-alt text-green-500"></i>
		  </button>
		  <button
			on:click={() => removeSkill(index)}
			class="remove-btn text-xs pr-2 transition-all duration-300 transform hover:scale-110"
		  >
			<i class="text-red-500 fa-solid fa-trash"></i>
		  </button>
		</section>
	  </div>
	{/each}
  </div>
  
  
