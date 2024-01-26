<script>
	import ResumeThemeOne from '../resume/ResumeThemeOne.svelte';
	import themeone from '../../lib/images/themeone.png';
	import themetwo from '../../lib/images/themetwo.png';
	import themethree from '../../lib/images/themethree.png';
	import { onMount } from 'svelte';

	let selectedImageSrc = '';
	let selectedTheme = '';

	function showImagePopup(imgSrc, theme) {
		selectedImageSrc = imgSrc;
		selectedTheme = theme;
		const popup = document.getElementById('imagePopup');
		popup.style.display = 'block';
	}

	function closeImagePopup() {
		const popup = document.getElementById('imagePopup');
		popup.style.display = 'none';
	}

	async function createResume() {
		const resumeNameInput = document.querySelector('#resumeNameInput');
		const resumeName = resumeNameInput.value;

		if (resumeName.trim() === '') {
			resumeNameInput.classList.add('!text-red-500/70', 'border-2', '!border-red-500');

			// Add shake effect to the input field
			resumeNameInput.classList.add('shake');

			// Remove the shake effect after
			setTimeout(() => {
				resumeNameInput.classList.remove('!text-red-500/70');
				resumeNameInput.classList.remove('shake');
			}, 500);

			return;
		}

		console.log('Selected Theme:', selectedTheme);
		console.log('Resume Name:', resumeName);

		// Make an API request with the selected theme and resume name
		try {
			const response = await fetch(`api/create`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
					// Add other headers if needed
				},
				body: JSON.stringify({
					selectedTheme,
					resumeName
				})
			});

			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}
			if (response.ok) {
				const responseData = await response.json();
				window.location.href = responseData.redirect;
			}
		} catch (error) {
			console.error('Error making API request:', error);
		}
	}

	onMount(()=>{
		const elements = document.querySelectorAll(".js-tilt");
VanillaTilt.init(elements,);
	})
</script>

<div class="flex justify-center align-middle mx-32">
	<a href="#theme" class="flex flex-col md:flex-row w-full   gap-2  resume-templates-list">
		<div class="container"  data-aos="fade-in"
		data-aos-offset="400"
		data-aos-delay="200"
		data-aos-duration="1000"
		data-aos-easing="ease-in-out"
		>
			<div class="box js-tilt" on:click={() => showImagePopup(themeone, 'Global Harmony')} data-tilt data-tilt-max="8" data-tilt-glare data-tilt-max-glare="2"    data-tilt-reset-to-start="true">
				<h2 class="theme-name">Global Harmony</h2>
				<img
					src={themeone}
					alt="img"
					class="rounded-lg shadow-lg relative themeone theme-img"
					title="Global Harmony"
				/>
				<span class="create-resume">Select theme</span>
			</div>
		</div>

		<div class="container"data-aos="fade-in"
		data-aos-offset="300"
		data-aos-delay="400"
		data-aos-duration="900"
		data-aos-easing="ease-in-out">
			<div class="box js-tilt" on:click={() => showImagePopup(themetwo, 'Timeless Traditions')} data-tilt data-tilt-max="8" data-tilt-glare data-tilt-max-glare="2"    data-tilt-reset-to-start="true">
				<h2 class="theme-name">Timeless Traditions</h2>
				<img
					src={themetwo}
					alt="img"
					class="rounded-lg shadow-lg relative themetwo theme-img"
					title="Timeless Traditions"
				/>
				<span class="create-resume">Select theme</span>
			</div>
		</div>

		<div class="container"data-aos="fade-in"
		data-aos-offset="200"
		data-aos-delay="600"
		data-aos-duration="800"
		data-aos-easing="ease-in-out">
			<div class="box js-tilt" on:click={() => showImagePopup(themethree, 'Pinnacle Profiles')} data-tilt data-tilt-max="8" data-tilt-glare data-tilt-max-glare="2"    data-tilt-reset-to-start="true">
				<h2 class="theme-name">Pinnacle Profiles</h2>
				<img
					src={themethree}
					alt="img"
					class="rounded-lg shadow-lg relative themethree theme-img"
					title="Pinnacle Profiles"
				/>
				<span class="create-resume">Select theme</span>
			</div>
		</div>
		<!-- </a> -->
	</a>
</div>

<!-- Image Popup -->
<!-- on:click={closeImagePopup} -->
<div id="imagePopup" class="popup">
	<div class="popup-content">
		<section class="js-tilt" data-tilt   data-tilt-max="2" data-tilt-speed="200 ">
		<span class="close text-red-800  md:text-white" on:click={closeImagePopup}>&times;</span>

		<a
			href="#"
			class="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl  dark:border-gray-700 dark:bg-gray-800 "
		>
			<img
				class="object-cover w-full rounded-t-lg h-auto md:h-auto md:w-48 md:rounded-none md:rounded-s-lg"
				src={selectedImageSrc}
				alt="img"
			/>
			<div class="flex flex-col justify-between p-4 leading-normal">
				<h5 class="mb-2 text:xl md:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
					Theme: {selectedTheme}
				</h5>
				<input
					type="text"
					id="resumeNameInput"
					placeholder="Enter Resume Name"
					class="mb-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
				/>

				<p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
					Customize your resume with the selected theme. Enter a unique name for your resume and
					click "Create" to generate it.
				</p>
				<input
					type="button"
					on:click={createResume}
					value="Next"
					class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline-blue cursor-pointer"
				/>
			</div>
		</a>
	</section>
	</div>
</div>

<!--  -->
<style>
	input::placeholder {
  color: #808080; 
}
	.resume-templates-list img:hover {
		box-shadow: 0px 4px 7px 0px rgba(0, 0, 0, 0.616);
		transition-delay: 200ms;
		transition-duration: 100ms;
		transform: translatey(-10px);
		border: 2px solid rgba(255, 0, 0, 0.068);
	}

	.resume-templates-list img {
		transition: transform 500ms;
	}
	.themeone::before {
		content: '';
		border: 2px solid red;
	}
	.popup {
		display: none;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.7);
	}

	.popup-content {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		text-align: center;
	}

	.close {
		/* color: #fff; */
		font-size: 24px;
		font-weight: bold;
		position: absolute;
		top: 10px;
		right: 10px;
		cursor: pointer;
	}
	.close:hover {
		color: rgba(255, 0, 0, 0.719);
		transition: 100ms ease-in-out;
	}
	.container {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
		width: 100%;
		transform-style: preserve-3d;
		transform: perspective(1000px);

	}
	.container .box {
		position: relative;
		width: 300px;
		height: 400px;
		margin: 40px;
		background: rgba(255, 255, 255, 0.1);
		border-radius: 10px;
		backdrop-filter: blur(5px);
		transform-style: preserve-3d;
		overflow: hidden;
		transform: perspective(1000px);
		box-shadow: 1px 1px 1px  rgba(54, 20, 20, 0.774);
	}
	.container .box:hover {
		border: 2px solid rgba(43, 41, 41, 0.377);
		box-shadow: 2px 2px 5px rgba(97, 94, 94, 0.267);
	}
	.container .box .theme-name {
		position: relative;
		top: 0;
		left: 0;
		text-align: center;
		width: 100%;
		transform-style: preserve-3d;
		color: rgb(255, 255, 255);
		opacity: 0;
		z-index: 10;
		transform: 0.5s;
		font-weight: 800;
	}
	.container .box:hover .theme-name {
		background-color: rgb(61, 122, 255);
		box-shadow:
			inset 2px 2px 10px rgba(184, 177, 245, 0.185),
			inset -2px -2px 10px rgba(138, 130, 216, 0.356);
		backdrop-filter: blur(5px);
		padding: 5px;
		top: 40px;
		transition-delay: 1000s;
		transition: 0.5s;

		opacity: 1;
	}

	.create-resume {
		cursor: pointer;
		position: absolute;
		opacity: 0;
		bottom: 0;
		left: 30%;
		transform-style: preserve-3d;
		color: rgb(0, 0, 0);
		/* background: rgba(0, 186, 233, 0.63); */
		padding: 10px 25px;
		backdrop-filter: blur(2px);
		border: 1px solid rgba(128, 128, 128, 0.836);
		border-radius: 5px;
		transition: 0.5s;
		transform: translate3d(-15%, 0, 0);
		width: 180px;
		font-weight: 900;
		text-align: center;
		z-index: 10;
		/* transition-delay: 200ms; */
		/* box-shadow:
			inset 2px 2px 5px rgba(7, 32, 143, 0.637),
			inset -2px -2px 5px rgba(177, 180, 194, 0.575),
			-2px 2px 20px rgba(53, 53, 53, 0.39); */
	}
	.container .box:hover .create-resume {
		opacity: 1;
		bottom: 10%;
		
	}
	.container .box .create-resume:hover {
		background-color: rgb(13, 195, 228);
		color: white;
	}
	.container .box .theme-img {
		position: absolute;
		top: 0%;
		left: 0%;
		/* transform: translate3D(-50%,-50%,0); */
		max-width: 100%;
		/* transform: 0.5s; */
		transition: 0.5s;
	}
	.container .box:hover .theme-img {
		/* max-width: 300px ; */
		transform-style: preserve-3d;
		-moz-transform: scale(1.2) rotate(17deg) translate(15px, 18px) skew(13deg, -15deg);
		-webkit-transform: scale(1.2) rotate(17deg) translate(15px, 18px) skew(13deg, -15deg);
		-o-transform: scale(1.2) rotate(17deg) translate(15px, 18px) skew(13deg, -15deg);
		-ms-transform: scale(1.2) rotate(17deg) translate(15px, 18px) skew(13deg, -15deg);
		transform: scale(1.2) rotate(17deg) translate(15px, 18px) skew(13deg, -15deg);
	}
</style>
