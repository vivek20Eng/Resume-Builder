<script>
	import { createEventDispatcher } from 'svelte';
	import SaveButton from '../home/SaveButton.svelte';
	import { afterUpdate } from 'svelte';
	import { languagesStore } from '../../lib/stores/languagesStore.js';

	let languages = [];
	let language = '';
	let proficiency = '';
	let showSuccessMessage = false;
	let languageErrorMessage = '';
	let proficiencyErrorMessage = '';
	let errorMessage = '';
	let isEditMode = false;
	let editIndex = null; // Track the index of the language being edited

	const dispatch = createEventDispatcher();

	function handleLanguageInformation() {
		// Reset error messages
		languageErrorMessage = '';
		proficiencyErrorMessage = '';
		errorMessage = '';

		if (!validateLanguage() || !validateProficiency()) {
			return;
		}

		if (
			languages.some(
				(lang, index) =>
					index !== editIndex && lang.language.toLowerCase() === language.trim().toLowerCase()
			)
		) {
			errorMessage = 'Language already added.';
			return;
		}

		if (isEditMode) {
			// Perform edit logic
			languages[editIndex] = { id: languages[editIndex].id, language, proficiency };

			// Reset form and hide after editing
			resetForm();
			isEditMode = false;
			editIndex = null;
		} else {
			saveLanguageAPI(language.trim(), proficiency);
		}
	}

	function saveLanguageAPI(language, proficiency) {
		const apiUrl = '/api/language';
		const urlParts = window.location.href.split('/');
		const resumeId = urlParts.pop();
		let requestOptions = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				language,
				proficiency,
				resumeId
			})
		};

		fetch(apiUrl, requestOptions)
			.then((response) => response.json())
			.then((data) => {
				console.log('API Response:', data);

				const insertedLanguageId = data.languageResult.id;
				console.log('Inserted language ID:', insertedLanguageId);

				languages = [...languages, { id: insertedLanguageId, language, proficiency }];
				languagesStore.set(languages);

				showSuccessMessage = true;

				setTimeout(() => {
					showSuccessMessage = false;
				}, 1000);
				dispatch('languageData', insertedLanguageId);

				// Reset form and hide after adding
				resetForm();
			})
			.catch((error) => console.error('Error:', error));
	}

	function removeLanguage(index) {
		languages = languages.filter((_, i) => i !== index);
	}

	function editLanguage(index) {
		// Set form fields for editing
		language = languages[index].language;
		proficiency = languages[index].proficiency;

		// Set form visibility and edit mode
		isEditMode = true;
		editIndex = index;
	}

	afterUpdate(() => {
		if (showSuccessMessage) {
			setTimeout(() => {
				showSuccessMessage = false;
			}, 1000);
		}
	});

	function validateLanguage() {
		if (!language.trim()) {
			languageErrorMessage = 'Please enter a language.';
			return false;
		}

		return true;
	}

	function validateProficiency() {
		if (!proficiency.trim() || proficiency.trim() === 'Select Proficiency') {
			proficiencyErrorMessage = 'Please select proficiency.';
			return false;
		}

		return true;
	}

	function resetForm() {
		// Reset form fields and error messages
		language = '';
		proficiency = '';
		languageErrorMessage = '';
		proficiencyErrorMessage = '';
		errorMessage = '';
	}
</script>

<div class="flex flex-wrap">
	<!-- language input -->
<div class="w-full md:mb-0">
	<label class="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2" for="grid-language">Language</label>
	<input
	  class="input-shade appearance-none block w-full text-gray-600 rounded py-3 px-4 mb-2 leading-tight focus:outline-none focus:bg-white"
	  id="grid-language"
	  type="text"
	  placeholder=""
	  bind:value={language}
	/>
	{#if languageErrorMessage && (!language.trim() || errorMessage === 'Language already added.')}
	  <div class="text-xs text-red-500 mt-2">{languageErrorMessage || errorMessage}</div>
	{/if}
  </div>
  

	<!-- proficiency dropdown with real-time validation -->
	<div class="w-full">
		<label class="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2" for="language"
			>Proficiency:</label
		>
		<select
			name="grid-proficiency"
			id="grid-proficiency"
			class="input-shade appearance-none block w-full text-gray-600 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
			bind:value={proficiency}
			on:input={validateProficiency}
		>
			<option value="" disabled>Select Proficiency</option>
			<option value="beginner">Beginner</option>
			<option value="intermediate">Intermediate</option>
			<option value="advanced">Advanced</option>
		</select>
		{#if proficiencyErrorMessage && (!proficiency.trim() || proficiency.trim() === 'Select Proficiency')}
			<div class="text-xs text-red-500 mt-2">{proficiencyErrorMessage}</div>
		{/if}
	</div>

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
				on:click|preventDefault={handleLanguageInformation}
			>
				{#if isEditMode}Save{:else}Add{/if}
			</button>
		</section>
	</div>
</div>

<!-- Display added languages and proficiencies -->
<div class="w-full mt-4 grid grid-cols-3 gap-3">
	{#each languages as { language, proficiency }, index (index)}
		<div
			class="flex items-center w-auto break-words bg-sky-300/20 shadow-md hover:shadow-lg rounded-lg px-4 py-2"
			key={index}
		>
			<section class="w-full flex items-center justify-between">
				<div class="flex items-center">
					<span class="text-gray-700 mr-2 break-words">{language}</span>
					<span class="text-gray-500">:</span>
					<span class="text-gray-700 ml-2">{proficiency}</span>
				</div>
				<div class="flex items-center gap-2">
					<button
						on:click={() => editLanguage(index)}
						class="edit-btn text-green-500 rounded-full focus:outline-none focus:shadow-outline-green transition duration-150 ease-in-out"
					>
						<i class="text-xs fas fa-pencil-alt"></i>
					</button>
					<button
						on:click={($event) => {
							$event.preventDefault();
							removeLanguage(index);
						}}
						class="remove-btn text-red-500 rounded-full focus:outline-none focus:shadow-outline-red transition duration-150 ease-in-out"
					>
						<i class="items-end fa-solid fa-trash text-xs"></i>
					</button>
				</div>
			</section>
		</div>
	{/each}
</div>
