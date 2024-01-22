<script>
	import { createEventDispatcher } from 'svelte';
	import SaveButton from '../home/SaveButton.svelte';
	import { afterUpdate } from 'svelte';
  import { socialMediaStore } from '../../lib/stores/socialMediaStore';
	let socialMediaEntries = {};
	let newPlatform = '';
	let newUrl = '';
	let showSuccessMessage = false;
	let errorMessage = '';
	let editingIndex = null;
	let requestBody = {};
	let platformInputField; // Reference to the platform input field
	let urlInputField; // Reference to the URL input field
  
	const dispatch = createEventDispatcher();
  
	function handleSocialMediaInformation() {
	  if (!validateUrl()) {
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
	  errorMessage = '';
	  showSuccessMessage = true;
  
	  setTimeout(() => {
		showSuccessMessage = false;
	  }, 1000);
	}
  
	function resetFields() {
	  newPlatform = '';
	  newUrl = '';
	}
  
	function removeSocialMedia(index) {
	  delete socialMediaEntries[index];
	  socialMediaEntries = { ...socialMediaEntries };
	}
  
	function cancelEdit() {
	  editingIndex = null;
	  resetFields();
	}
  
	function fillFormWithEditingData() {
	  newPlatform = socialMediaEntries[editingIndex].platform;
	  newUrl = socialMediaEntries[editingIndex].url;
	}
  
	function validateUrl() {
	  const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
	  if (!newUrl.trim() || !newUrl.match(urlRegex)) {
		errorMessage = 'Please enter a valid URL.';
		return false;
	  }
  
	  errorMessage = '';
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
	  socialMediaStore.set({platform,url})

  
	  let requestOptions = {
		method: 'POST',
		headers: {
		  'Content-Type': 'application/json',
		},
		body: JSON.stringify({
		  platform,
		  url,
		  resumeId,
		  socialMediaId: requestBody.socialMediaId, // Include socialMediaId when editing
		}),
	  };
  
	  // Adjust request method for editing
	  if (requestBody.socialMediaId) {
		requestOptions.method = 'PUT'; // Assuming your server supports the PUT method for updates
	  }
  
	  fetch(apiUrl, requestOptions)
		.then((response) => response.json())
		.then((data) => {
		  console.log('API Response:', data);
  
		  const insertedSocialMediaId = data.socialMediaResult.id;
		  console.log('Inserted social media ID:', insertedSocialMediaId);
  
		  if (requestBody.socialMediaId) {
			// If socialMediaId is present, it means we are updating an existing entry
			const updatedSocialMediaEntries = Object.keys(socialMediaEntries).reduce(
			  (acc, key) => {
				const id = socialMediaEntries[key].id;
				acc[id] = id === requestBody.socialMediaId ? { id, platform, url } : socialMediaEntries[key];
				return acc;
			  },
			  {}
			);
			socialMediaEntries = updatedSocialMediaEntries;
		  } else {
			// If socialMediaId is not present, it means we are adding a new entry
			socialMediaEntries[insertedSocialMediaId] = { id: insertedSocialMediaId, platform, url };
		  }
  
		  // Reset requestBody.socialMediaId after update or insert
		  requestBody.socialMediaId = null;
  
		  // Dispatch an event
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
	.remove-btn,
	.edit-btn {
	  cursor: pointer;
	  padding: 0.5rem;
	  margin-left: 0.5rem;
	}
  
	.remove-btn {
	  color: #e53e3e;
	}
  
	.edit-btn {
	  color: #3182ce;
	}
  </style>
  
  <div class="flex flex-wrap">
	<!-- Platform -->
	<div class="w-full px-3 md:mb-0">
		<label
		  class="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
		  for="grid-platform"
		>Platform:</label>
	  
		<select
		  name="grid-platform"
		  id="grid-platform"
		  class="input-shade appearance-none block w-full text-gray-300 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
		  bind:value={newPlatform}
		>
		  <option value="github" selected={newPlatform === 'github'}>GitHub</option>
		  <option value="linkedin" selected={newPlatform === 'linkedin'}>LinkedIn</option>
		  <option value="instagram" selected={newPlatform === 'instagram'}>Instagram</option>
		</select>
	  </div>
  
	<!-- URL -->
	<div class="w-full px-3 md:mb-0 mt-5">
	  <label
		class="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
		for="grid-url">URL</label
	  >
	  <input
		class="input-shade appearance-none block w-full text-gray-300 rounded py-3 px-4 mb-2 leading-tight focus:outline-none focus:bg-white"
		id="grid-url"
		type="text"
		placeholder=""
		bind:value={newUrl}
		bind:this={urlInputField}
	  />
	</div>
  
	<!-- Error Message -->
	{#if errorMessage}
	  <div class="text-xs text-red-500 mt-2">{errorMessage}</div>
	{/if}
  
	<!-- Success Message -->
	{#if showSuccessMessage}
	  <div class="text-xs text-green-500 mt-2">Saved successfully!</div>
	{/if}
  
	<!-- Social Media Entries -->
	<div class="w-full mt-4">
	
	{#each Object.values(socialMediaEntries) as { id, platform, url }, index (index)}
	  <div class="flex items-center space-x-2 mb-2" key={index}>
		<span class="bg-gray-300 text-gray-700 px-2 py-1 rounded">
		  {platform} - {url}
		</span>
		<button
		  on:click|preventDefault={() => {
			editingIndex = id;
			newPlatform = socialMediaEntries[id].platform;
			newUrl = socialMediaEntries[id].url;
			// Set socialMediaId when editing
			requestBody.socialMediaId = id;
			// Check if platformInputField is defined before calling focus
			if (platformInputField) {
			  platformInputField.focus();
			}
		  }}
		  class="edit-btn">
		  <i class="fas fa-pencil-alt"></i>
		</button>
		<button
		  on:click|preventDefault={() => {
			cancelEdit();
		  }}
		  class="remove-btn">
		  <i class="fas fa-times"></i>
		</button>
	  </div>
	{/each}
  </div>
  
	<!-- Submit Button -->
	<div class="flex justify-end w-full mt-2">
	  <button
		class="save-btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
		on:click|preventDefault={handleSocialMediaInformation}>
		<button>{editingIndex !== null ? 'Save' : 'Add'} </button>
	  </button>
	</div>
  </div>
  