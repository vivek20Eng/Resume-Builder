<!-- StepperForm.svelte -->
<script>
	import { onMount } from 'svelte';
	import Language from '../resumeForms/Language.svelte';
	import Skill from '../resumeForms/Skill.svelte';
	import BasicInformation from '../resumeForms/BasicInformation.svelte';
	import Projects from '../resumeForms/Projects.svelte';
	import SocialMedia from '../resumeForms/SocialMedia.svelte';
	import WorkExperience from '../resumeForms/WorkExperience.svelte';
	import Education from '../../components/resumeForms/Education.svelte';

	import { createEventDispatcher } from 'svelte';
	let workExperienceInformation = {};
	let addressInformation = {};
	let basicInformation = {};
	let educationInformation = {};
	let languageInformation = {};
	let projectInformation = {};
	let skillInformation = {};
	let socialMediaInformation = {};
	let templateName = 'Edit';
	let showSuccessMessage = false;
	let errorMessage = '';

	const dispatch = createEventDispatcher();

	function handleResumeData(event) {
		if (event.type === 'basicInformationData') {
			if (event.addressResult) {
				basicInformation = event.detail;
			} else {
				addressInformation = event.detail;
			}
		} else if (event.type === 'addressResult') {
			addressInformation = event.detail;
		} else if (event.type === 'experienceData') {
			workExperienceInformation = event.detail;
		} else if (event.type === 'educationData') {
			educationInformation = event.detail;
		} else if (event.type === 'projectData') {
			projectInformation = event.detail;
		} else if (event.type === 'languageData') {
			languageInformation = event.detail;
		} else if (event.type === 'skillData') {
			skillInformation = event.detail;
		} else if (event.type === 'socialMediaData') {
			socialMediaInformation = event.detail;
		}
	}

	async function createResume() {
		const urlParts = window.location.href.split('/');
		const resumeId = urlParts.pop();
		const response = await fetch('/editor/resume', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				resumeId,
				workExperienceInformation,
				addressInformation,
				basicInformation,
				educationInformation,
				languageInformation,
				projectInformation,
				skillInformation,
				socialMediaInformation
			})
		});

		if (response.ok) {
			const data = await response.json();
			console.log('Resume created:', data);

			if (data.redirect) {
				showSuccessMessage = true;

				// Hide success message after 3000ms
				setTimeout(() => {
					showSuccessMessage = false;
				}, 3000);

				window.location.href = data.redirect;
			} else {
				console.error('Redirect path not provided in the response.');
			}
		} else {
			console.error('Failed to create resume');
			errorMessage = 'Error creating resume. Please try again.';
		}
	}
	let currentStep = 1;
	let totalSteps = 8;

	onMount(() => {
		// You can perform initialization or fetch data here
	});

	function nextStep() {
		if (currentStep < totalSteps) {
			currentStep += 1;
		}
	}

	function previousStep() {
		if (currentStep > 1) {
			currentStep -= 1;
		}
	}
</script>

<div class="stepper-container mx-10 mt-5 flex">
	<div class="stepper flex flex-col">
		<section>
			<div class="step {currentStep === 1 && 'active'}">
				<!-- Step 1 Content -->
				<span class="flex align-middle justify-center"
					><h2 class="font-bold">Basic information</h2></span
				>

				<BasicInformation on:basicInformationData={handleResumeData} />
			</div>

			<div class="step {currentStep === 2 && 'active'}">
				<!-- Step 2 Content -->
				<span class="flex align-middle justify-center"><h2 class="font-bold">Education</h2></span>
				<Education on:educationData={handleResumeData} />
			</div>
			<div class="step {currentStep === 3 && 'active'}">
				<!-- Step 2 Content -->
				<span class="flex align-middle justify-center"><h2 class="font-bold">Project</h2></span>
				<Projects on:projectData={handleResumeData} />
			</div>
			<div class="step {currentStep === 4 && 'active'}">
				<!-- Step 3 Content -->
				<span class="flex align-middle justify-center"
					><h2 class="font-bold">WorkExperience</h2></span
				>
				<WorkExperience on:experienceData={handleResumeData} />
			</div>

			<div class="step {currentStep === 5 && 'active'}">
				<!-- Step 3 Content -->
				<span class="flex align-middle justify-center"><h2 class="font-bold">Skill</h2></span>
				<!-- <LanguageComponent/> -->
				<Skill on:skillData={handleResumeData} />
			</div>
			<div class="step {currentStep === 6 && 'active'}">
				<!-- Step 3 Content -->
				<span class="flex align-middle justify-center"><h2 class="font-bold">SocialMedia</h2></span>
				<SocialMedia on:socialMediaData={handleResumeData} />
			</div>
			<div class="step {currentStep === 7 && 'active'}">
				<!-- Step 3 Content -->
				<span class="flex align-middle justify-center"><h2 class="font-bold">Language</h2></span>
				<!-- <LanguageComponent/> -->
				<Language on:languageData={handleResumeData} />
			</div>
		</section>
		<section>

			<div class="button-container items-end justify-end relative bottom-0">
				<button
					on:click={previousStep}
					class="{currentStep === 1 &&
						'previous'} w-10 h-10 p-2 rounded-full cursor-pointer bg-sky-500 hover:bg-sky-700 text-white duration-75"
					><i class="  fa-solid fa-backward"></i></button
				>
				{#if currentStep < totalSteps}
					<button
						on:click={nextStep}
						class="w-10 h-10 p-2 rounded-full cursor-pointer bg-sky-500 hover:bg-sky-700 text-white duration-75"
						><i class="fa-solid fa-forward"></i></button
					>
				{:else}
<div class="flex flex-col">				<p class="text-lg leading-7">Ensure the accuracy of the provided details, and upon confirmation, proceed to click the 'Create Resume' button to generate your personalized resume. </p><br/>

					<div class="flex justify-end">
						<button
							type="submit"
							class="m-5 text-white rounded-lg shadow-sm"
							on:click|preventDefault={createResume}
						>
							<div
								class="w-full h-full relative inline-flex items-center justify-center p-4 px-6 py-2 overflow-hidden font-medium text-sky-600 transition duration-300 ease-out border-2 border-sky-500 rounded-lg shadow-md group"
							>
								<span
									class="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-sky-400 group-hover:translate-x-0 ease"
								>
									<svg
										class="w-6 h-6"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M14 5l7 7m0 0l-7 7m7-7H3"
										></path>
									</svg>
								</span>
								<span
									class="absolute flex items-center justify-center w-full h-full text-sky-500 transition-all duration-300 transform group-hover:translate-x-full ease"
									>create resume</span
								>
								<span class="relative invisible">create resume</span>
							</div>
						</button>
					</div>
				</div>

				{/if}
			</div>
		</section>
	</div>
</div>
<!-- 999 ---->

<style>
	.stepper-container {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
	}

	.stepper {
		width: 100%;
		height: 100%;
		padding: 20px;
		border: 1px solid #ccc;
		border-radius: 8px;
	}

	.step {
		display: none;
	}

	.step.active {
		display: block;
	}

	.button-container {
		display: flex;
		justify-content: space-between;
		margin-top: 20px;
	}

	button.previous {
		background-color: #ccc;
	}
</style>
