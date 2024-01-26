<script>
	import { createEventDispatcher } from 'svelte';
	import { afterUpdate } from 'svelte';
	import { socialMediaStore } from '../../lib/stores/socialMediaStore';
  
	let socialMediaEntries = {};
	let newPlatform = '';
	let newUrl = '';
	let showSuccessMessage = false;
	let platformErrorMessage = '';
	let urlErrorMessage = '';
	let editingIndex = null;
	let requestBody = {};
	let platformInputField;
	let urlInputField;
	let isEditMode = false;
  
	const dispatch = createEventDispatcher();
  
	function handleSocialMediaInformation() {
	  // Reset error messages
	  platformErrorMessage = '';
	  urlErrorMessage = '';
  
	  if (!validatePlatform() || !validateUrl()) {
		return;
	  }
  
	  console.log('Platform:', newPlatform);
  
	  if (editingIndex !== null) {
		socialMediaEntries[editingIndex].platform = newPlatform;
		socialMediaEntries[editingIndex].url = newUrl;
		editingIndex = null;
	  } else {
		saveSocialMediaAPI(newPlatform, newUrl);
	  }
  
	  resetFields();
	  showSuccessMessage = true;
  
	  setTimeout(() => {
		showSuccessMessage = false;
	  }, 1000);
	  isEditMode = false;
	}
  
	function resetFields() {
	  newPlatform = '';
	  newUrl = '';
	}
  
	function removeSocialMedia(index) {
	  const { [index]: deleted, ...rest } = socialMediaEntries;
	  socialMediaEntries = rest;
	  socialMediaStore.set(socialMediaEntries);
	}
  
	function fillFormWithEditingData() {
	  newPlatform = socialMediaEntries[editingIndex].platform;
	  newUrl = socialMediaEntries[editingIndex].url;
	  isEditMode = true;
	}
  
	function validateUrl() {
	  const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
	  if (!newUrl.trim() || !newUrl.match(urlRegex)) {
		urlErrorMessage = 'Please enter a valid URL.';
		return false;
	  }
  
	  return true;
	}
  
	function validatePlatform() {
	  if (!newPlatform.trim()) {
		platformErrorMessage = 'Please select a platform.';
		return false;
	  }
  
	  return true;
	}
  
	afterUpdate(() => {
	  if (showSuccessMessage) {
		setTimeout(() => {
		  showSuccessMessage = false;
		}, 1000);
	  }
	});
  
	function saveSocialMediaAPI(platform, url) {
	  const apiUrl = '/api/social-media';
	  const resumeId = getResumeId();
  
	  let requestOptions = {
		method: 'POST',
		headers: {
		  'Content-Type': 'application/json',
		},
		body: JSON.stringify({
		  platform,
		  url,
		  resumeId,
		  socialMediaId: requestBody.socialMediaId,
		}),
	  };
  
	  if (requestBody.socialMediaId) {
		requestOptions.method = 'PUT';
	  }
  
	  fetch(apiUrl, requestOptions)
		.then((response) => response.json())
		.then((data) => {
		  console.log('API Response:', data);
  
		  const insertedSocialMediaId = data.socialMediaResult.id;
		  console.log('Inserted social media ID:', insertedSocialMediaId);
  
		  if (requestBody.socialMediaId) {
			const updatedSocialMediaEntries = Object.keys(socialMediaEntries).reduce(
			  (acc, key) => {
				const id = socialMediaEntries[key].id;
				acc[id] =
				  id === requestBody.socialMediaId ? { id, platform, url } : socialMediaEntries[key];
				return acc;
			  },
			  {}
			);
			socialMediaEntries = updatedSocialMediaEntries;
			socialMediaStore.set(updatedSocialMediaEntries);
		  } else {
			socialMediaEntries[insertedSocialMediaId] = { id: insertedSocialMediaId, platform, url };
			socialMediaStore.set(socialMediaEntries);
		  }
  
		  requestBody.socialMediaId = null;
  
		  dispatch('socialMediaData', insertedSocialMediaId);
		})
		.catch((error) => console.error('Error:', error));
	}
  
	function getResumeId() {
	  const urlParts = window.location.href.split('/');
	  return urlParts.pop();
	}
  </script>
  
  <style>
	/* Add your styles here */
  </style>
  
  <div class="flex flex-wrap">
	<!-- Platform -->
	<div class="w-full  md:mb-0">
	  <label class="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2" for="grid-platform">Platform:</label>
  
	  <select
		name="grid-platform"
		id="grid-platform"
		class="input-shade appearance-none block w-full text-gray-600 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
		bind:value={newPlatform}
		bind:this={platformInputField}
	  >
		<option value="" disabled>Select a platform</option>
		<option value="github" selected={newPlatform === 'github'}>GitHub</option>
		<option value="linkedin" selected={newPlatform === 'linkedin'}>LinkedIn</option>
		<option value="instagram" selected={newPlatform === 'instagram'}>Instagram</option>
	  </select>
  
	  <!-- Error Message for Platform -->
	  {#if platformErrorMessage}
		<div class=" text-xs text-red-500 mt-2">{platformErrorMessage}</div>
	  {/if}
	</div>
  
	<!-- URL -->
	<div class="w-full  md:mb-0 mt-5">
	  <label class="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2" for="grid-url">URL</label>
  
	  <input
		class="input-shade appearance-none block w-full text-gray-600 rounded py-3 px-4 mb-2 leading-tight focus:outline-none focus:bg-white"
		id="grid-url"
		type="text"
		placeholder=""
		bind:value={newUrl}
		bind:this={urlInputField}
	  />
  
	  <!-- Error Message for URL -->
	  {#if urlErrorMessage}
		<div class=" text-xs text-red-500 mt-2">{urlErrorMessage}</div>
	  {/if}
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
			resetFields();
		  }}
		>
		  <span>Cancel</span>
		</button>
  
		<button
		  class="save-btn px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:border-blue-700 focus:shadow-outline-green active:bg-blue-800 transition duration-150 ease-in-out"
		  on:click|preventDefault={handleSocialMediaInformation}
		>
		  {#if isEditMode}
			Save
		  {:else}
			Add
		  {/if}
		</button>
	  </section>
	</div>
  </div>
  
  <!-- Social Media Entries -->
  <div class="w-full mt-4">
	{#each Object.values(socialMediaEntries) as { id, platform, url }, index (index)}
	  <div class="flex items-center gap-2  mb-2 border rounded p-2 bg-sky-300/20 shadow-ms hover:shadow-lg" key={index}>
		<div class="flex-grow">
		  <span class="text-gray-700">{platform}</span> - <span class="text-gray-500">{url}</span>
		</div>
		<div class="flex items-center gap-2">
		  <button
			on:click|preventDefault={() => {
			  editingIndex = id;
			  fillFormWithEditingData();
			  // Set socialMediaId when editing
			  requestBody.socialMediaId = id;
			  // Check if platformInputField is defined before calling focus
			  if (platformInputField) {
				platformInputField.focus();
			  }
			}}
			class="edit-btn text-blue-500 hover:text-blue-700"
		  >
			<i class="fas fa-pencil-alt text-xs"></i>
		  </button>
  
		  <button
			on:click|preventDefault={() => {
			  removeSocialMedia(id);
			}}
			class="remove-btn text-red-500 hover:text-red-700"
		  >
			<i class="fas fa-trash text-xs"></i>
		  </button>
		</div>
	  </div>
	{/each}
  </div>
  