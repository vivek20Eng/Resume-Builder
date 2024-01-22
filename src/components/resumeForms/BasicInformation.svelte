<script>
	import { createEventDispatcher } from 'svelte';
	import SaveButton from '../home/SaveButton.svelte';
	import md5 from 'md5';
import {basicDetailsStore} from "../../lib/stores/basicDetailsStore.js"
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

	let getUserGravatarUrl = function (email) {
		const gravatarHash = md5(email.trim().toLowerCase());
				// Calculate the MD5 hash of the email
		const gravatarUrl = `https://www.gravatar.com/avatar/${gravatarHash}?s=200&d=identicon&adicons`;
		console.log(gravatarUrl, 'gravatarUrlgravatarUrl');
		return gravatarUrl;
	};

	const dispatch = createEventDispatcher();
	let showSuccessMessage = false;
	let errorMessage = '';

	function handleBasicInformation() {
		if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(gravatarLink)) {
						// Use the provided email directly
			imageUrl = getUserGravatarUrl(gravatarLink);
			console.log('email', imageUrl);
		} else if (/^https?:\/\//.test(gravatarLink)) {
			// Use the provided URL directly
			imageUrl = gravatarLink;
			console.log('url', imageUrl);
		} else {
		}

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
		};

		const apiUrl = '/api/basic-detail';
		const urlParts = window.location.href.split('/');
		const resumeId = urlParts.pop();
		console.log(resumeId, 'sdf');

		formData.resumeId = resumeId;
		basicDetailsStore.set(formData);

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
				console.log('API Response:', data);
				console.log(formData, 'basicinfo');
				const insertedbasicInformationtId = data;

				dispatch('basicInformationData', insertedbasicInformationtId);

				// Show success message
				showSuccessMessage = true;

				// Hide success message after 3000ms
				setTimeout(() => {
					showSuccessMessage = false;
				}, 3000);
			})
			.catch((error) => {
				console.error('Error:', error);
				errorMessage = 'Error saving basic information. Please try again.';
			});
	}
</script>


<div class="flex flex-wrap">
	<!-- Full Name -->
	<div class="w-full md:w-2/2 px-3 md:mb-0">
		<label
			class="block uppercase tracking-wide text-slate-400 text-xs font-bold mb-2"
			for="grid-first-name"
		>
			Full Name
		</label>
		<input
			bind:value={fullName}
			class="input-shade appearance-none block w-full text-gray-600 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
			id="grid-first-name"
			type="text"
			placeholder=""
			name="full_name"
			required
		/>
	</div>
	<!-- Email -->
	<div class="w-full md:w-2/2 px-3 md:mb-0">
		<label
			class="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
			for="grid-email"
		>
			Email
		</label>
		<input
			bind:value={email}
			class="input-shade appearance-none block w-full text-gray-600 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
			id="grid-email"
			type="email"
			placeholder=""
			name="email"
			required
		/>
	</div>
	<!-- Phone Number -->
	<div class="w-full md:w-2/2 px-3 md:mb-0">
		<label
			class="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
			for="grid-number"
		>
			Phone Number
		</label>
		<input
			bind:value={phoneNumber}
			class="input-shade appearance-none block w-full text-gray-600 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
			id="grid-number"
			type="tel"
			placeholder=""
			name="phone_number"
			required
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
			class="input-shade appearance-none block w-full text-gray-600 rounded py-3 px-4  leading-tight focus:outline-none focus:bg-white"
			id="grid-image"
			type="text"
			placeholder=""
			name="image"
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
		/>
	</div>
	<!-- pin code -->
	<div class="w-full md:w-2/4 px-3 md:mb-0 mt-2">
		<label
			class="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
			for="grid-pinCode"
		>
			pin code
		</label>
		<input
			bind:value={pinCode}
			class="input-shade appearance-none block w-full text-gray-600 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
			id="grid-pinCode"
			type="text"
			placeholder=""
			name="pinCode"
			required
		/>
	</div>
	<!-- current_location -->
	<div class="w-full md:w-2/4 px-3 md:mb-0 mt-2">
		<label
			class="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
			for="grid-currentLocation"
		>
			current Location
		</label>
		<input
			bind:value={currentLocation}
			class="input-shade appearance-none block w-full text-gray-600 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
			id="grid-currentLocation"
			type="text"
			placeholder=""
			name="currentLocation"
			required
		/>
	</div>
	<!-- Designiation -->
	<div class="w-full md:w-2/2 px-3 md:mb-0 mt-2">
		<label
			class="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
			for="grid-desigination"
		>
			Desigination
		</label>
		<input
			bind:value={desigination}
			class="input-shade appearance-none block w-full text-gray-600 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
			id="grid-designation"
			type="text"
			placeholder=""
			name="desigination"
			required
		/>
	</div>
	<!-- summary -->
	<div class="w-full md:w-2/2 px-3 md:mb-0">
		<label
			class="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
			for="grid-summary"
		>
			Describe your-self
		</label>
		<textarea
			bind:value={summary}
			class="input-shade appearance-none block w-full text-gray-600 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
			id="grid-summary"
			type="text"
			placeholder=""
			name="summary"
			required
		/>
	</div>

<!-- Success Message -->
{#if showSuccessMessage}
<div class="text-xs text-green-500 mt-2">Saved successfully!</div>
{/if}

<!-- Error Message -->
{#if errorMessage}
<div class="text-xs text-red-500 mt-2">{errorMessage}</div>
{/if}

	<!-- Submit Button -->
	<div class="flex justify-end w-full">
		<button class="save-btn" on:click|preventDefault={handleBasicInformation}>
			<SaveButton>save</SaveButton></button
		>
	</div>
</div>


