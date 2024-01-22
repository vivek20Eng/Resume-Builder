<script>
	import { createEventDispatcher } from 'svelte';
	import SaveButton from '../home/SaveButton.svelte';
	import { afterUpdate } from 'svelte';
	import { languagesStore } from '../../lib/stores/languagesStore.js';
	let languages = [];
	let language = '';
	let proficiency = '';
	let showSuccessMessage = false;
	let errorMessage = '';

	const dispatch = createEventDispatcher();

	function handleLanguageInformation() {
		if (!validateLanguage() || !validateProficiency()) {
			return;
		}

		if (languages.some((lang) => lang.language.toLowerCase() === language.trim().toLowerCase())) {
			errorMessage = 'Language already added.';
			return;
		}

		saveLanguageAPI(language.trim(), proficiency);
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

				errorMessage = '';

				language = '';
				proficiency = '';

				showSuccessMessage = true;

				setTimeout(() => {
					showSuccessMessage = false;
				}, 1000);
			})
			.catch((error) => console.error('Error:', error));
	}

	function removeLanguage(index) {
		languages = languages.filter((_, i) => i !== index);
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
			errorMessage = 'Please enter a language.';
			return false;
		}
		errorMessage = '';
		return true;
	}

	function validateProficiency() {
		if (!proficiency.trim()) {
			errorMessage = 'Please select proficiency.';
			return false;
		}
		errorMessage = '';
		return true;
	}
</script>

<div class="flex flex-wrap">
	<!-- language input -->
	<div class="w-full px-3 md:mb-0">
		<label
			class="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
			for="grid-language"
		>
			Language
		</label>
		<input
			class="input-shade appearance-none block w-full text-gray-300 rounded py-3 px-4 mb-2 leading-tight focus:outline-none focus:bg-white"
			id="grid-language"
			type="text"
			placeholder=""
			bind:value={language}
		/>
	</div>

	<!-- proficiency dropdown with real-time validation -->
	<div class="w-full px-3">
		<label
			class="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
			for="language"
		>
			Proficiency:
		</label>

		<select
			name="grid-proficiency"
			id="grid-proficiency"
			class="input-shade appearance-none block w-full text-gray-300 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
			bind:value={proficiency}
			on:input={validateProficiency}
		>
			<option value="">Select Proficiency</option>
			<option value="beginner">Beginner</option>
			<option value="intermediate">Intermediate</option>
			<option value="advanced">Advanced</option>
		</select>
	</div>
	<section class="flex flex-row justify-between w-full">
		<div class="w-full">
			<!-- Success Message -->
			{#if showSuccessMessage}
				<div class="text-xs text-green-500 mt-2">Saved successfully!</div>
			{/if}

			<!-- Error Message -->
			{#if errorMessage}
				<div class="text-xs text-red-500 mt-2">{errorMessage}</div>
			{/if}
		</div>
		<!-- Add button for adding the language and proficiency -->
		<div class="flex justify-end w-full mt-2">
			<button on:click|preventDefault={handleLanguageInformation} class="save-btn">
				<SaveButton>Save</SaveButton>
			</button>
		</div>
	</section>
	<!-- Display added languages and proficiencies -->
	<div class="w-full mt-4 grid grid-cols-3 gap-3">
		{#each languages as { language, proficiency }, index (index)}
			<div class="flex items-center w-auto" key={index}>
				<section class="bg-gray-300 px-2 rounded-full w-full">
					<span class=" text-gray-700 px-2 py-1 rounded w-full">
						{language} : {proficiency}
					</span>
					<button
						on:click={($event) => {
							$event.preventDefault();
							removeLanguage(index);
						}}
						class="remove-btn"><i class="items-end fa-solid fa-xmark text-red-500"></i></button
					>
				</section>
			</div>
		{/each}
	</div>
</div>
