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

	function handleSkillInformation() {
		skillsStore.set(skills)

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
		} else {
			// Adding a new skill
			saveSkillAPI(newSkill);

		}

		// Reset input field and error message
		newSkill = '';
		errorMessage = '';

		// Show success message
		showSuccessMessage = true;

		// Hide success message after 1000ms
		setTimeout(() => {
			showSuccessMessage = false;
		}, 1000);
	}

	function removeSkill(index) {
		skills.splice(index, 1);
		skills = [...skills]; 
		skillsStore.set(skills)
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

<div class="flex flex-wrap">
	<!-- Skill -->
	<section class="w-full">
	<div class="">
		<!-- Skill -->
		<div class="w-full  flex">
			<input
				class="  input-shade appearance-none block w-full text-gray-900 rounded  mb-2  focus:outline-none focus:bg-white"
				
				type="text"
				placeholder="Python, Django, HTML"
				bind:value={newSkill}
				bind:this={inputField}
			/>
		</div>

		<!-- Submit Button -->
		<div class="flex justify-between ">
			<section>
				<!-- Error Message -->
{#if errorMessage}
<div class="text-xs text-red-500 mt-2">{errorMessage}</div>
{/if}

<!-- Success Message -->
{#if showSuccessMessage}
<div class="text-xs text-green-500 mt-2">Saved successfully!</div>
{/if}
			</section>
			<button class="save-btn" on:click|preventDefault={handleSkillInformation}>
				<SaveButton>{#if editingIndex !== null}
					Save
				{:else}
					Add
				{/if}</SaveButton></button
			>
		</div>
	</div>

</section>
	<!-- Skills Entries -->
	<div class="w-full mt-4">
		{#each skills as { id, skill }, index (id)}
			<div class="flex items-center space-x-2 mb-2" key={id}>
				<section class="bg-gray-300 px-2 rounded-full flex justify-between min-w-32">
					<span class="text-sm text-gray-700 px-2 py-1 rounded">
						{skill}
					</span>
					<section class="flex justify-between gap-2">
						<button on:click={() => removeSkill(index)} class="remove-btn text-xs">
							<i class="text-red-500 fa-solid fa-xmark"></i>
						</button>
						<button
							on:click={() => {
								editingIndex = index;
								newSkill = skill;
								// Set skillId when editing
								requestBody.skillId = id;
								// Focus on the input field
								inputField.focus();
							}}
							class="edit-btn text-xs"
						>
							<i class="text-xs fas fa-pencil-alt"></i>
						</button>
					</section>
				</section>
			</div>
		{/each}
	</div>
</div>
