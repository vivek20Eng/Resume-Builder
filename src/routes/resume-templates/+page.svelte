<script>
	import Template from '../../components/ResumeTemplates/Template.svelte';
	import resumeSVG from '../../lib/images/resumeBanner.svg';
	import resumeVector from '../../lib/images/resumeVector.svg';
	import Breadcrumbs from '../../components/home/Breadcrumbs.svelte';
	let templateName = 'Resume Templates';
</script>

<section class="mx-10 my-5" data-aos="fade-right"
data-aos-offset="200"
data-aos-delay="50"
data-aos-duration="1000"
data-aos-easing="ease-in-out"
data-aos-anchor-placement="top-center">
	<Breadcrumbs page={templateName} />
	<p class=" text-2xl md:text-5xl font-extrabold text-gray-500">Resume Templates</p>
	<span class="text-sky-300 text-sm md:text-lg">Early Career Resumes</span><br />

	<div class="myBox mt-2 rounded-2xl"></div>
</section>

<section class="w-full absolute -z-10"data-aos="fade-in"
data-aos-offset="200"
data-aos-delay="200"
data-aos-duration="1000"
data-aos-easing="ease-in-out">
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"
		><path
			fill="#0099ff"
			fill-opacity="1"
			d="M0,96L48,106.7C96,117,192,139,288,133.3C384,128,480,96,576,117.3C672,139,768,213,864,256C960,299,1056,309,1152,293.3C1248,277,1344,235,1392,213.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
		></path></svg
	>
</section>
<div class="w-full" data-aos="fade-up"
data-aos-offset="200"
data-aos-delay="50"
data-aos-duration="1000"
data-aos-easing="ease-in-out">
	<section class="w-full h-auto flex flex-col md:flex-row items-center md:justify-center align-middle relative">
		<div class="bg-red-300/10 backdrop-blur-xl w-10/12 md:w-8/12 h-full rounded-2xl shadow-lg home-banner">
			<div class="grid grid-row-1 md:grid-cols-4 gap-4 p-10 font-semibold ">
				<div class=" cursor-pointer">
					Resumes
					<p class="text-sm text-gray-800/40 font-mono">Student/Intermediate</p>
				</div>
				<div class="">
					CVs
					<p class="text-sm text-gray-800/40 font-mono">Senior</p>
				</div>
				<div class="...">
					Cover Letters
					<p class="text-sm text-gray-800/40 font-mono">All levels of experience</p>
				</div>
				<div class="col-span-1 md:row-span-4 w-full h-full">
					<p class="text-sm text-gray-800/40 font-mono">
						<img src={resumeSVG} alt="img" class="w-full h-full" />
					</p>
				</div>
				<div class="col-span-2 md:col-span-3 text-xl">Pick from 2+ [Free] Resume Templates</div>

				<div class="col-span-2 text-gray-800/50">
					Pick one of our free resume templates, fill it out, and land that dream job! Create and
					download your professional resume in less than 5 minutes.
				</div>
			</div>
		</div>
	</section>
	<!-- <img src={resumeVector} alt="img" class="md:m-10 w-full  md:w-3/12 absolute" /> -->
</div>
<section class="w-full h-6/12 relative top-10">
	<Template />
</section>

<style>
	.myBox {
		text-align: center;
		border-bottom: 5px solid transparent;
		border-radius: 50%;
		border-image: linear-gradient(
			0.25turn,
			rgb(0, 131, 124),
			rgb(0, 175, 206),
			rgba(56, 2, 155, 0)
		);
		border-image-slice: 1;
		width: 5%;
	}
	.home-banner {
		border-top: 2px solid rgba(255, 255, 255, 0.616);
		border-left: 2px solid rgba(255, 255, 255, 0.671);
		border-bottom: 2px solid rgba(0, 0, 0, 0.096);
		border-right: 2px solid rgba(0, 0, 0, 0.096);
		box-shadow:
			inset 2px 2px 20px rgba(231, 228, 228, 0.801),
			2px 2px 7px rgba(0, 0, 0, 0.158);
	}
</style>
