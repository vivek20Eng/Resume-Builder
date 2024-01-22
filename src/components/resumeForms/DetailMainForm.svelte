<script>
	import { onMount } from 'svelte';
	import BasicInformation from './BasicInformation.svelte';
	import Education from './Education.svelte';
	import Language from './Language.svelte';
	import WorkExperience from './WorkExperience.svelte';
	import Projects from './Projects.svelte';
	import Skill from './Skill.svelte';
	import SocialMedia from './SocialMedia.svelte';
	import Breadcrumbs from '../home/Breadcrumbs.svelte';
	import SaveButton from '../home/SaveButton.svelte';
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
</script>

<svelte:head>
	<title>Form - Stepper Form</title>
</svelte:head>
<div class="absolute">
	<section
		class="m-5 md:m-10"
		data-aos="fade-in"
		data-aos-offset="300"
		data-aos-delay="500"
		data-aos-duration="1000"
		data-aos-easing="ease-in-out"
	>
		<Breadcrumbs page={templateName} />

		<p class="text-2xl md:text-5xl font-extrabold text-gray-500">Resume Templates</p>
		<span class="text-sky-300 text-sm md:text-lg">/ 0 - 5 years of experience</span><br />

		<div class="myBox mt-2 rounded-2xl"></div>
	</section>

	<div
		class="flex  gap-10"
		data-aos="fade-in"
		data-aos-offset="200"
		data-aos-delay="300"
		data-aos-duration="1000"
		data-aos-easing="ease-in-out"
	>
		<form
			on:submit|preventDefault={createResume}
			class="!overflow-visible w-full md:w-6/12 bg-gray-200/40 rounded-lg m-5 shadow-lg backdrop-blur-lg"
		>
			<section autocollapse>
				<div class="border-b   p-2 border-2 border-gray-400/10 rounded-lg " open>
					<div 
						><i class="text-sky-400 fa-solid fa-circle-info"></i></div
					>
					<div
						><h1 class="font-bold text-slate-600">Basic Information</h1></div
					>
					<div 
						><BasicInformation on:basicInformationData={handleResumeData} /></div
					>
				</div>
				<div class="border-b    p-2 border-2 border-gray-400/10 rounded-lg ">
					<div 
						><i class="text-sky-400 fa-solid fa-school"></i></div
					>
					<div
						><h1 class="font-bold text-slate-600">Education</h1></div
					>
					<div 
						><Education on:educationData={handleResumeData} /></div
					>
				</div>
				<div class="border-b    p-2 border-2 border-gray-400/10 rounded-lg ">
					<div 
						><i class="text-sky-400 fa-solid fa-check"></i></div
					>
					<div
						><h1 class="font-bold text-slate-600">WorkExperience</h1></div
					>
					<div 
						><WorkExperience on:experienceData={handleResumeData} /></div
					>
				</div>
				<div class="border-b   p-2 border-2 border-gray-400/10 rounded-lg ">
					<div 
						><i class="text-sky-400 fa-solid fa-diagram-project"></i></div
					>
					<div
						><h1 class="font-bold text-slate-600">Projects</h1></div
					>
					<div 
						><Projects on:projectData={handleResumeData} /></div
					>
				</div>
				<div class="border-b   p-2 border-2 border-gray-400/10 rounded-lg ">
					<div 
						><i class="text-sky-400 fa-solid fa-diagram-project"></i></div
					>
					<div
						><h1 class="font-bold text-slate-600">Language</h1></div
					>
					<div 
						><Language on:languageData={handleResumeData} /></div
					>
				</div>
				<div class="border-b   p-2 border-2 border-gray-400/10 rounded-lg ">
					<div 
						><i class="text-sky-400 fa-solid fa-diagram-project"></i></div
					>
					<div
						><h1 class="font-bold text-slate-600">Skill</h1></div
					>
					<div ><Skill on:skillData={handleResumeData} /></div
					>
				</div>
				<div class="border-b   p-2 border-2 border-gray-400/10 rounded-lg ">
					<div 
						><i class="text-sky-400 fa-solid fa-diagram-project"></i></div
					>
					<div
						><h1 class="font-bold text-slate-600">Social Media</h1></div
					>
					<div 
						><SocialMedia on:socialMediaData={handleResumeData} /></div
					>
				</div>
			</section>
			<div class="flex justify-end">
				<button type="submit" class="m-5 text-white rounded-lg shadow-sm">
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
		</form>

		<!-- <div class="w-full">
			<ResumeThemeTwo />
		</div> -->
	</div>
</div>
<div
	class=" z-10"
	data-aos="fade-down"
	data-aos-offset="100"
	data-aos-delay="50"
	data-aos-duration="1000"
	data-aos-easing="ease-in-out"
>
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"
		><path
			fill="#0099ff"
			fill-opacity="1"
			d="M0,32L20,37.3C40,43,80,53,120,64C160,75,200,85,240,117.3C280,149,320,203,360,202.7C400,203,440,149,480,149.3C520,149,560,203,600,213.3C640,224,680,192,720,176C760,160,800,160,840,138.7C880,117,920,75,960,53.3C1000,32,1040,32,1080,58.7C1120,85,1160,139,1200,176C1240,213,1280,235,1320,229.3C1360,224,1400,192,1420,176L1440,160L1440,0L1420,0C1400,0,1360,0,1320,0C1280,0,1240,0,1200,0C1160,0,1120,0,1080,0C1040,0,1000,0,960,0C920,0,880,0,840,0C800,0,760,0,720,0C680,0,640,0,600,0C560,0,520,0,480,0C440,0,400,0,360,0C320,0,280,0,240,0C200,0,160,0,120,0C80,0,40,0,20,0L0,0Z"
		></path></svg
	>
</div>

<style>
	.myBox {
		text-align: center;
		border-bottom: 5px solid transparent;
		border-image: linear-gradient(
			0.25turn,
			rgb(0, 131, 124),
			rgb(0, 175, 206),
			rgba(56, 2, 155, 0)
		);
		border-image-slice: 1;
		width: 10%;
	}
</style>
