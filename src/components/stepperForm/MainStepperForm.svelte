<!-- StepperForm.svelte -->
<script>
	import { onMount } from 'svelte';
	import ListDetail from './ListDetail.svelte';
	import SkillComponent from './SkillComponent.svelte';
	import BasicDetail from './BasicDetail.svelte';
	import Language from '../resumeForms/Language.svelte';
	import LanguageComponent from './LanguageComponent.svelte';
	import Skill from '../resumeForms/Skill.svelte';
	import BasicInformation from '../resumeForms/BasicInformation.svelte';
	import Projects from '../resumeForms/Projects.svelte';
	import SocialMedia from '../resumeForms/SocialMedia.svelte';
	import WorkExperience from '../resumeForms/WorkExperience.svelte';
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

	function submitForm() {
		// You can perform form submission or additional actions here
		console.log('Form submitted!');
	}
</script>

<div class="stepper-container mx-10 mt-5 flex">
	<div class="stepper  flex flex-col ">
		<section>
			<div class="step {currentStep === 1 && 'active'}">
				<!-- Step 1 Content -->
				<span class="flex align-middle justify-center"><h2 class="font-bold">Basic information</h2></span>
				
<BasicInformation/>
		</div>

			<div class="step {currentStep === 2 && 'active'}">
				<!-- Step 2 Content -->
				<span class="flex align-middle justify-center"><h2 class="font-bold">Add your skills</h2></span>
				<Skill/>
			</div>
			<div class="step {currentStep === 3 && 'active'}">
				<!-- Step 2 Content -->
				<span class="flex align-middle justify-center"><h2 class="font-bold">Add your skills</h2></span>
				<Skill/>
			</div>
			<div class="step {currentStep === 4 && 'active'}">
				<!-- Step 3 Content -->
				<span class="flex align-middle justify-center"><h2 class="font-bold">Language</h2></span>
				<!-- <LanguageComponent/> -->
				<Language/>
			</div>
			<div class="step {currentStep === 5 && 'active'}">
				<!-- Step 3 Content -->
				<span class="flex align-middle justify-center"><h2 class="font-bold">Project</h2></span>
				<!-- <LanguageComponent/> -->
				<Projects/>
			</div>
			<div class="step {currentStep === 6 && 'active'}">
				<!-- Step 3 Content -->
				<span class="flex align-middle justify-center"><h2 class="font-bold">SocialMedia</h2></span>
				<SocialMedia/>
			</div>
			<div class="step {currentStep === 7 && 'active'}">
				<!-- Step 3 Content -->
				<span class="flex align-middle justify-center"><h2 class="font-bold">WorkExperience</h2></span>
<WorkExperience/>
			</div>
		</section>
		<section>
			<div class="button-container items-end justify-end relative bottom-0">
				<button on:click={previousStep} class="{currentStep === 1 && 'previous'} w-10 h-10 p-2 rounded-full cursor-pointer bg-sky-500 hover:bg-sky-700 hover:text-white duration-75"><i class="  fa-solid fa-backward"></i></button>
				{#if currentStep < totalSteps}
					<button on:click={nextStep} class="w-10 h-10 p-2 rounded-full cursor-pointer bg-sky-500 hover:bg-sky-700 hover:text-white duration-75"><i class="fa-solid fa-forward"></i></button>
				{:else}
					<button on:click={submitForm}>Submit</button>
				{/if}
			</div>
		</section>
	</div>
</div>

<!-- 999 ---->

<style>
	/* Add your styling for the form here */
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
