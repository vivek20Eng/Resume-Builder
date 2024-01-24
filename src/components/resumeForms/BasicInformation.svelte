<script>
	import { createEventDispatcher } from 'svelte';
	import SaveButton from '../home/SaveButton.svelte';
	import md5 from 'md5';
	import { basicDetailsStore } from '../../lib/stores/basicDetailsStore.js';
  
	// Constants
	const API_URL = '/api/basic-detail';
	const TOAST_TIMEOUT = 3000;
  
	// Variables
	let fullName = '';
	let email = '';
	let phoneNumber = '';
	let address = '';
	let city = '';
	let state = '';
	let country = '';
	let desigination = '';
	let summary = '';
	let pinCode = '';
	let currentLocation = '';
	let gravatarLink = '';
	let imageUrl = '';
  
	// Event dispatcher
	const dispatch = createEventDispatcher();
  
	// Messages
	let successMessage = '';
	let errorMessage = '';
  
	// Button State
	let isEditMode = false;
  
	// Functions
	function getUserGravatarUrl(email) {
	  const gravatarHash = md5(email.trim().toLowerCase());
	  const gravatarUrl = `https://www.gravatar.com/avatar/${gravatarHash}?s=200&d=identicon&adicons`;
	  console.log(gravatarUrl, 'gravatarUrlgravatarUrl');
	  return gravatarUrl;
	}
  
	function showSuccessToast(message) {
	  successMessage = message;
	  setTimeout(() => {
		successMessage = '';
	  }, TOAST_TIMEOUT);
	  // Clear error message when success occurs
	  errorMessage = '';
	}
  
	function showErrorToast(message) {
	  errorMessage = message;
	}
  
	function handleBasicInformation() {
	  if (isEditMode) {
		//  edit functionality
  
		// After handling edit, switch back to save mode
		isEditMode = false;
	  } else {
		// Validation: Check if required fields are filled
		if (!fullName || !email || !phoneNumber || !desigination || !summary) {
		  showErrorToast('Please fill out all required fields.');
		  return;
		}
  
		// Handle image URL or gravatar
		if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(gravatarLink)) {
		  imageUrl = getUserGravatarUrl(gravatarLink);
		  console.log('email', imageUrl);
		} else if (/^https?:\/\//.test(gravatarLink)) {
		  imageUrl = gravatarLink;
		  console.log('url', imageUrl);
		}
  
		// Prepare form data
		const formData = {
		  full_name: fullName,
		  email,
		  phone_number: phoneNumber,
		  address,
		  city,
		  state,
		  country,
		  desigination,
		  summary,
		  pinCode,
		  currentLocation,
		  imageUrl
		  // Use imageUrl instead of gravatarLink
		};
  
		// Set form data in the store
		basicDetailsStore.set(formData);
  
		// API Request
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
  
		fetch(API_URL, requestOptions)
		  .then((response) => response.json())
		  .then((data) => {
			console.log('API Response:', data);
			const insertedBasicInformationId = data;
			dispatch('basicInformationData', insertedBasicInformationId);
			showSuccessToast('Saved successfully!');
  
			// Switch to edit mode after saving
			isEditMode = true;
		  })
		  .catch((error) => {
			console.error('Error:', error);
			showErrorToast('Error saving basic information. Please try again.');
		  });
	  }
	}
  </script>
  

<div class="flex flex-wrap">
	<!-- Full Name -->
	<div class="w-full md:w-2/2 px-3 md:mb-0">
		<label
			class="block uppercase tracking-wide text-slate-400 text-xs font-bold mb-2"
			for="grid-first-name"
		>
			* Full Name
		</label>
		<input
			bind:value={fullName}
			class:required={!fullName}
			class="input-shade appearance-none block w-full text-gray-600 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
			id="grid-first-name"
			type="text"
			placeholder=""
			name="full_name"
			required
			readonly={isEditMode}
		/>
	</div>

	<!-- Email -->
	<div class="w-full md:w-2/2 px-3 md:mb-0">
		<label
			class="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
			for="grid-email"
		>
			* Email
		</label>
		<input
			bind:value={email}
			class:required={!email}
			class="input-shade appearance-none block w-full text-gray-600 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
			id="grid-email"
			type="email"
			placeholder=""
			name="email"
			required
			readonly={isEditMode}
		/>
	</div>

	<!-- Phone Number -->
	<div class="w-full md:w-2/2 px-3 md:mb-0">
		<label
			class="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
			for="grid-number"
		>
			* Phone Number
		</label>
		<input
			bind:value={phoneNumber}
			class:required={!phoneNumber}
			class="input-shade appearance-none block w-full text-gray-600 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
			id="grid-number"
			type="tel"
			placeholder=""
			name="phone_number"
			required
			readonly={isEditMode}
		/>
	</div>

	<!-- image -->
	<div class="w-full md:w-2/2 px-3 md:mb-0">
		<label
			class="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
			for="grid-image"
		>
			Image address
		</label>
		<input
			bind:value={gravatarLink}
			on:blur={() => getUserGravatarUrl(gravatarLink)}
			class="input-shade appearance-none block w-full text-gray-600 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
			id="grid-image"
			type="text"
			placeholder=""
			name="image"
			readonly={isEditMode}
		/>
		<span class="text-xs text-slate-500 mb-3">Enter your email (gravatar) or public image url</span>
	</div>

	<!-- Address -->
	<div class="w-full md:w-1/1 px-3 md:mb-0">
		<label
			class="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
			for="grid-address"
		>
			Address
		</label>
		<input
			bind:value={address}
			class="input-shade appearance-none block w-full text-gray-600 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
			id="grid-address"
			type="text"
			placeholder=""
			name="address"
			required
			readonly={isEditMode}
		/>
	</div>

	<!-- City, State, Country -->
	<!-- City -->
	<div class="w-full md:w-1/3 px-3 md:mb-0 mt-2">
		<label
			class="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
			for="grid-city"
		>
			City
		</label>
		<input
			bind:value={city}
			class="input-shade appearance-none block w-full text-gray-600 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
			id="grid-city"
			type="text"
			placeholder=""
			name="city"
			required
			readonly={isEditMode}
		/>
	</div>

	<!-- State -->
	<div class="w-full md:w-1/3 px-3 md:mb-0 mt-2">
		<label
			class="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
			for="grid-state"
		>
			State
		</label>
		<input
			bind:value={state}
			class="input-shade appearance-none block w-full text-gray-600 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
			id="grid-state"
			type="text"
			placeholder=""
			name="state"
			required
			readonly={isEditMode}
		/>
	</div>

	<!-- Country -->
	<div class="w-full md:w-1/3 px-3 md:mb-0 mt-2">
		<label
			class="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
			for="grid-country"
		>
			Country
		</label>
		<input
			bind:value={country}
			class="input-shade appearance-none block w-full text-gray-600 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
			id="grid-country"
			type="text"
			placeholder=""
			name="country"
			required
			readonly={isEditMode}
		/>
	</div>

	<!-- pin code -->
	<div class="w-full md:w-2/4 px-3 md:mb-0 mt-2">
		<label
			class="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
			for="grid-pinCode"
		>
			Pin Code
		</label>
		<input
			bind:value={pinCode}
			class="input-shade appearance-none block w-full text-gray-600 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
			id="grid-pinCode"
			type="text"
			placeholder=""
			name="pinCode"
			required
			readonly={isEditMode}
		/>
	</div>

	<!-- current_location -->
	<div class="w-full md:w-2/4 px-3 md:mb-0 mt-2">
		<label
			class="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
			for="grid-currentLocation"
		>
			Current Location
		</label>
		<input
			bind:value={currentLocation}
			class="input-shade appearance-none block w-full text-gray-600 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
			id="grid-currentLocation"
			type="text"
			placeholder=""
			name="currentLocation"
			required
			readonly={isEditMode}
		/>
	</div>

	<!-- Designation -->
	<div class="w-full md:w-2/2 px-3 md:mb-0 mt-2">
		<label
			class="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
			for="grid-desigination"
		>
			* Designation
		</label>
		<input
			bind:value={desigination}
			class="input-shade appearance-none block w-full text-gray-600 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
			id="grid-designation"
			type="text"
			placeholder=""
			name="desigination"
			required
			readonly={isEditMode}
		/>
	</div>

	<!-- Summary -->
	<div class="w-full md:w-2/2 px-3 md:mb-0">
		<label
			class="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
			for="grid-summary"
		>
			* Describe yourself
		</label>
		<textarea
			bind:value={summary}
			class="input-shade appearance-none block w-full text-gray-600 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
			id="grid-summary"
			type="text"
			placeholder=""
			name="summary"
			required
			readonly={isEditMode}
		/>
	</div>

	<!-- Success Message -->
	{#if successMessage}
		<div class="toast success">{successMessage}</div>
	{/if}

	<!-- Error Toast -->
	{#if errorMessage}
		<div class="toast error">{errorMessage}</div>
	{/if}

	<!-- Submit Button -->
<div class="flex justify-end w-full mt-5 mr-3">
	<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-center" on:click|preventDefault={handleBasicInformation}>
	  {#if isEditMode}
		<span class="">Edit</span>
	  {:else}
		<span class="">Save</span>
	  {/if}
	</button>
  </div>
  
</div>

<style>
	/* Add your styles here for toast notifications */
	.toast {
		position: fixed;
		top: 16px;
		right: 16px;
		padding: 12px;
		border-radius: 4px;
		font-size: 14px;
		color: #fff;
		z-index: 9999;
		transform-origin: top right;
	}

	.success {
		background-color: #28a745; /* Green */
	}

	.error {
		background-color: #dc3545; /* Red */
	}
</style>
