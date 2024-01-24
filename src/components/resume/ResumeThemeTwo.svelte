<script lang="ts">
	// Import html2pdf.js only on the client side
	import { onMount } from 'svelte';
import DownloadBtn from '../home/DownloadBtn.svelte';
import WaveSpline from '../home/WaveSpline.svelte';
	let html2pdf;
	
	onMount(async () => {
	  const images = document.querySelectorAll('img');
	  const promises = Array.from(images).map((img) => new Promise((resolve) => img.onload = resolve));
	  await Promise.all(promises);
  
	  try {
		const module = await import('html2pdf.js');
		html2pdf = module.default;
	  } catch (error) {
		console.error('Error importing html2pdf:', error);
	  }
	});
  
	export let ResumeThemeTwo;
	const userData = ResumeThemeTwo.body.resume;
	
	// Variables to store error and success messages
	let errorMessage = '';
	let successMessage = '';
	
	// Function to map proficiency values to stars
	const getStars = (proficiency) => {
	  switch (proficiency.toLowerCase()) {
		case 'beginner':
		  return '⭐☆☆';
		case 'intermediate':
		  return '⭐⭐☆';
		case 'advanced':
		  return '⭐⭐⭐';
		default:
		  return '';
	  }
	};
	
	const downloadAsPDF = () => {
    try {
      var element = document.getElementById('resume-download');
      html2pdf(element);
      // Set success message when the download succeeds
      successMessage = 'PDF download successful!';
      // Clear any previous error messages
      errorMessage = '';

      // Clear success message after 2 seconds 
      setTimeout(() => {
        successMessage = '';
      }, 2000);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      // Set an error message to display in the template
      errorMessage = 'Error downloading PDF';
      // Clear any previous success messages
      successMessage = '';
    }
  };
  </script>
  <WaveSpline/>
  
   <div on:click={downloadAsPDF}>
	<DownloadBtn/>
 </div>
  {#if errorMessage}
	<p style="color: red;">{errorMessage}</p>
  {/if}
  
  {#if successMessage}
	<p style="color: green;">{successMessage}</p>
  {/if}
  
 
  

<div class="resume rounded-lg shadow-2xl w-full z-10" id="resume-download"  >
	<div class="resume_left">
		{#if userData.basic_details}
			<div class="resume_profile">
				{#each userData.basic_details as { avatar_src }}
					{#if avatar_src && avatar_src.length > 5}
						<img src={avatar_src} alt="profile_pic" />
					{/if}
				{/each}
			</div>
		{/if}
		<div class="resume_content">
			<div class="resume_item resume_info">
				<div class="title">
					<p class="bold">
						{#if userData}
							{#each userData.basic_details as fullname}
								{fullname.full_name}
							{/each}
						{/if}
					</p>
					<p class="regular">
						{#if userData}
							{#each userData.basic_details as designation}
								{designation.designation}
							{/each}
						{/if}
					</p>
				</div>
				{#if userData}
					<ul>
						{#each userData.addresses as userInfo}
							<li>
								<div class="icon">
									<i class="fas fa-map-signs"></i>
								</div>
								<div class="data">
									{userInfo.address}
								</div>
							</li>
						{/each}
						{#each userData.basic_details as userInfo}
							<li>
								<div class="icon">
									<i class="fas fa-mobile-alt"></i>
								</div>
								<div class="data">
									{userInfo.phone}
								</div>
							</li>
							<li>
								<div class="icon">
									<i class="fas fa-envelope"></i>
								</div>
								<div class="data">
									{userInfo.email}
								</div>
							</li>
						{/each}
						<!-- <li>
             <div class="icon">
               <i class="fab fa-weebly"></i>
             </div>
             <div class="data">
               www.stephen.com
             </div>
           </li> -->
					</ul>
				{/if}
			</div>
			{#if userData.skills}
				<div class="resume_item resume_skills">
					<div class="title">
						<p class="bold">skill's</p>
					</div>
					<ul>
						{#each userData.skills as skill}
							<li>
								<div class="skill_name">{skill.skill}</div>
								<div class="skill_progress">
									<span style="width: 80%;"></span>
								</div>
								<div class="skill_per">80%</div>
							</li>
						{/each}
					</ul>
				</div>
			{/if}
			{#if userData.social_media}
				<div class="resume_item resume_social">
					<div class="title">
						<p class="bold">Social</p>
					</div>
					<ul>
						{#each userData.social_media as platform}
							<li>
								<div class="icon">
									{#if platform.platform === 'instagram'}
										<i class="fa-brands fa-instagram"></i>
									{:else if platform.platform === 'github'}
										<i class="fa-brands fa-github"></i>
									{:else if platform.platform === 'linkedin'}
										<i class="fab fa-linkedin"></i>
									{:else}
										<i class="fab fa-question"></i>
									{/if}
								</div>
								<div class="data">
									<p class="semi-bold">{platform.platform}</p>
									<p class="truncate w-40">
										<a href={platform.url} class="!text-xs semi-bold text-red-800 break-words"
											>{platform.url}</a
										>
									</p>
								</div>
							</li>
						{/each}
					</ul>
				</div>
			{/if}
		</div>
	</div>
	<div class="resume_right">
		<div class="resume_item resume_about">
			<div class="title">
				<p class="bold">About us</p>
			</div>
			<p>
				{#if userData}
					{#each userData.basic_details as details}
						{details.summary}
					{/each}
				{/if}
			</p>
		</div>
		{#if userData.work_experiences}
			<div class="resume_item resume_work">
				<div class="title">
					<p class="bold">Work Experience</p>
				</div>
				<ul>
					{#each userData.work_experiences as experience}
						<li>
							<div class="date">from {experience.joining_date} to {experience.worked_till}</div>
							<div class="info">
								<p class="semi-bold">{experience.company}</p>
								<p>{experience.designation}</p>
							</div>
						</li>
					{/each}
				</ul>
			</div>
		{/if}

		{#if userData.educations}
			<div class="resume_item resume_education">
				<div class="title">
					<p class="bold">Education</p>
				</div>
				<ul>
					{#each userData.educations as education}
						<li>
							<div class="date">{education.passout_year}</div>
							<div class="info">
								<p class="semi-bold">{education.specialization}</p>
								<p>{education.institution}</p>
							</div>
						</li>
					{/each}
				</ul>
			</div>
		{/if}
		<!-- projects -->
		{#if userData.projects.title}
			<div class="resume_item resume_education">
				<div class="title">
					<p class="bold">Projects</p>
				</div>
				<ul>
					{#each userData.projects as projects}
						<li>
							<div class="semi-bold">{projects.title}</div>
							<div class="info">
								<p class="date text-gray-600">{projects.start_date}</p>
								<p>{projects.description}</p>
							</div>
						</li>
					{/each}
				</ul>
			</div>
		{/if}
		<!-- language -->
		{#if userData.languages}
		<div class="resume_item resume_language">
			<div class="title">
			  <p class="bold">Language</p>
			</div>
			<ul>
			  {#each userData.languages as { language, proficiency }}
				<li>
				  <div class="semi-bold">{language}</div>
				  <div class="info">
					<p class="date text-gray-600">{getStars(proficiency)}</p>
				  </div>
				</li>
			  {/each}
			</ul>
		  </div>
		{/if}
		<div class="resume_item resume_hobby">
			<div class="title">
				<p class="bold">Hobby</p>
			</div>
			<ul>
				<li><i class="fas fa-book"></i></li>
				<li><i class="fas fa-gamepad"></i></li>
				<li><i class="fas fa-music"></i></li>
				<li><i class="fab fa-pagelines"></i></li>
			</ul>
		</div>
	</div>
</div>

<style>
	@import url('https://fonts.googleapis.com/css?family=Montserrat:400,500,700&display=swap');

	.bold {
		font-weight: 700;
		font-size: 20px;
		text-transform: uppercase;
	}

	.semi-bold {
		font-weight: 500;
		font-size: 16px;
	}

	.resume {
		width: 800px;
		height: auto;
		display: flex;
		margin: 50px auto;
	}

	.resume .resume_left {
		width: 280px;
		background: #0bb5f4;
	}

	/* .resume .resume_left .resume_profile {
		width: 100%;
		height: 280px;
	} */

	.resume .resume_left .resume_profile img {
		width: 100%;
		height: 100%;
	}

	.resume .resume_left .resume_content {
		padding: 0 25px;
	}

	.resume .title {
		margin-bottom: 20px;
	}

	.resume .resume_left .bold {
		color: #fff;
	}

	.resume .resume_left .regular {
		color: #b1eaff;
	}

	.resume .resume_item {
		padding: 25px 0;
		border-bottom: 2px solid #b1eaff;
	}

	.resume .resume_left .resume_item:last-child,
	.resume .resume_right .resume_item:last-child {
		border-bottom: 0px;
	}

	.resume .resume_left ul li {
		display: flex;
		margin-bottom: 10px;
		align-items: center;
	}

	.resume .resume_left ul li:last-child {
		margin-bottom: 0;
	}

	.resume .resume_left ul li .icon {
		width: 35px;
		height: 35px;
		background: #fff;
		color: #0bb5f4;
		border-radius: 50%;
		margin-right: 15px;
		font-size: 16px;
		position: relative;
	}

	.resume .icon i,
	.resume .resume_right .resume_hobby ul li i {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.resume .resume_left ul li .data {
		color: #b1eaff;
	}

	.resume .resume_left .resume_skills ul li {
		display: flex;
		margin-bottom: 10px;
		color: #b1eaff;
		justify-content: space-between;
		align-items: center;
	}

	.resume .resume_left .resume_skills ul li .skill_name {
		width: 25%;
	}

	.resume .resume_left .resume_skills ul li .skill_progress {
		width: 60%;
		margin: 0 5px;
		height: 5px;
		background: #009fd9;
		position: relative;
	}

	.resume .resume_left .resume_skills ul li .skill_per {
		width: 15%;
	}

	.resume .resume_left .resume_skills ul li .skill_progress span {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		background: #fff;
	}

	.resume .resume_left .resume_social .semi-bold {
		color: #fff;
		margin-bottom: 3px;
	}

	.resume .resume_right {
		width: 520px;
		background: #fff;
		padding: 25px;
	}

	.resume .resume_right .bold {
		color: #0bb5f4;
	}

	.resume .resume_right .resume_work ul,
	.resume .resume_right .resume_education ul,
	.resume .resume_right .resume_project ul {
		padding-left: 40px;
		overflow: hidden;
	}

	.resume .resume_right ul li {
		position: relative;
	}

	.resume .resume_right ul li .date {
		font-size: 16px;
		font-weight: 500;
		margin-bottom: 15px;
	}

	.resume .resume_right ul li .info {
		margin-bottom: 20px;
	}

	.resume .resume_right ul li:last-child .info {
		margin-bottom: 0;
	}

	.resume .resume_right .resume_work ul li:before,
	.resume .resume_right .resume_education ul li:before {
		content: '';
		position: absolute;
		top: 5px;
		left: -25px;
		width: 6px;
		height: 6px;
		border-radius: 50%;
		border: 2px solid #0bb5f4;
	}

	.resume .resume_right .resume_work ul li:after,
	.resume .resume_right .resume_education ul li:after {
		content: '';
		position: absolute;
		top: 14px;
		left: -21px;
		width: 2px;
		height: 115px;
		background: #0bb5f4;
	}

	.resume .resume_right .resume_hobby ul {
		display: flex;
		justify-content: space-between;
	}

	.resume .resume_right .resume_hobby ul li {
		width: 80px;
		height: 80px;
		border: 2px solid #0bb5f4;
		border-radius: 50%;
		position: relative;
		color: #0bb5f4;
	}

	.resume .resume_right .resume_hobby ul li i {
		font-size: 30px;
	}

	.resume .resume_right .resume_hobby ul li:before {
		content: '';
		position: absolute;
		top: 40px;
		right: -52px;
		width: 50px;
		height: 2px;
		background: #0bb5f4;
	}

	.resume .resume_right .resume_hobby ul li:last-child:before {
		display: none;
	}

	@media screen and (max-width: 825px) {
		.resume {
			/* width: 200px; */
			/* margin: 50px; */
			/* height:auto; */
		}
	}
</style>
