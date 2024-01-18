<script>
	import homewave from '../../lib/images/homewave.svg';
	import { Application } from '@splinetool/runtime';
	import { onMount } from 'svelte';
	let isLoading = true;
	onMount(async () => {
		// app.load('https://prod.spline.design/MWQPCP2HvIJqdDMi/scene.splinecode');

		// app.load('https://prod.spline.design/xB-e4x-gLobm6jwG/scene.splinecode');

		const canvas = document.getElementById('canvas3d');
		const app = new Application(canvas);
		try {
			// await app.load('https://prod.spline.design/ldwAQvWpnZwr12LY/scene.splinecode');
			// await app.load('https://prod.spline.design/uM4F0X08rKgK4fU1/scene.splinecode');
			// await app.load('https://prod.spline.design/uM4F0X08rKgK4fU1/scene.splinecode');
			await app.load('https://prod.spline.design/FYc9763CpFCV6w8S/scene.splinecode');


		} catch (error) {
			console.error('Error loading spline:', error);
		}
	});
</script>

<canvas id="canvas3d" class="absolute z-10"></canvas>
<div
	class="home-container flex justify-between w-full h-screen"
	data-aos="fade-right"
	data-aos-offset="200"
	data-aos-delay="100"
	data-aos-duration="1000"
	data-aos-easing="ease-in-out"
	data-aos-mirror="true"
	data-aos-once="false"
	data-aos-anchor-placement="top-center"
>
	<div class=" mr-10 mt-10 ml-10 md:mt-32 md:ml-20 font-light z-10">
		<p class=" text-4xl md:text-5xl 2xl:text-7xl font-extrabold text-gray-900">Build your resume</p>
		<div class="myBox mt-2 rounded-2xl"></div>
		<p
			class="text-sm md:text-lg xl:text-2xl mt-5 md:mt-10 font-bold text-slate-600 leading-6 md:leading-10 xl:leading-[40px] tracking-wide"
		>
			Unlock your potential and pave the way to professional success with our intuitive and<br />
			customizable resume builder. Tailor your story, showcase your skills, <br />and stand out in
			the competitive job market effortlessly.
		</p>
		<p
			class=" font-heading-token text-2xl md:text-3xl font-extrabold mt-10 leading-10 xl:leading-[40px] tracking-wide text-sky-600"
		>
			Build your new resume in as little as 5 minutes.<br />
			<b class="font-mono text-xl md:text-2xl text-gray-600">Try it for free.</b>
		</p>
		<section
			class="flex gap-5 mt-5 md:mt-10"
			data-aos="fade-in-out"
			data-aos-delay="800"
			data-aos-duration="1000"
			data-aos-easing="ease-in-out"
		>
			<a
				href="/resume-templates"
				class="relative inline-flex items-center justify-center p-2 px-3 py-2 md:p-4 md:px-6 md:py-3 overflow-hidden font-medium text-indigo-600 transition duration-300 ease-out border-2 border-sky-500 rounded-full shadow-md group"
			>
				<span
					class="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-sky-600 group-hover:translate-x-0 ease"
				>
					<svg
						class="w-6 h-6"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M14 5l7 7m0 0l-7 7m7-7H3"
						></path></svg
					>&nbsp Create Resume
				</span>
				<span
					class="text-lg absolute flex items-center justify-center w-full h-full text-sky-600 transition-all duration-300 transform group-hover:translate-x-full ease"
					>Create Resume</span
				>
				<span class="relative invisible text-lg ">Create Resume</span>
			</a>
		</section>
	</div>
</div>

<div
	class="wave-patter-home bottom-0 md:bottom-[-100px] "
	data-aos="fade-up"
	data-aos-delay="500"
	data-aos-duration="1000"
>
	<!-- <img src={homewave} alt="img" data-aos-easing="ease-in-out" /> -->
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#0099ff" fill-opacity="1" d="M0,128L40,149.3C80,171,160,213,240,202.7C320,192,400,128,480,128C560,128,640,192,720,218.7C800,245,880,235,960,208C1040,181,1120,139,1200,117.3C1280,96,1360,96,1400,96L1440,96L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"></path></svg>

</div>

<style>
	.home-container {
		position: relative;
		overflow: hidden;
	}
	.wave-patter-home {
		position: absolute;
		z-index: 1000;
		width: 100%;
		/* height: 100px; */
		/* bottom: -100px; */
		overflow: hidden;
	}
	img {
		-webkit-filter: drop-shadow(5px 5px 5px #222);
		filter: drop-shadow(15px 15px 5px rgba(34, 34, 34, 0.178));
	}
</style>
