<script>
    import { onMount } from 'svelte';
    import { skillsStore } from '../../lib/stores/skillsStore.js';
    import { languagesStore } from '../../lib/stores/languagesStore.js';
    import { basicDetailsStore } from '../../lib/stores/basicDetailsStore.js';
    import { socialMediaStore } from '../../lib/stores/socialMediaStore.js';
    import { educationStore } from '../../lib/stores/educationStore.js';
    import { projectsStore } from '../../lib/stores/projectsStore.js';
  import {workExperienceStore} from '../../lib/stores/workExperienceStore.js'
    let skills = [];
    let languages = [];
    let basicDetails = {};
    let socialMedia = [];
    let educations = [];
    let projects = [];
  let workExperience = [];
    onMount(() => {
      const skillsUnsubscribe = skillsStore.subscribe(value => {
        skills = value;
        console.log(skills, 'store skills');
      });
      const basicDetailsUnsubscribe = basicDetailsStore.subscribe(value => {
        basicDetails = value;
        console.log(basicDetails, 'basicDetails store values');
      });
      const languagesUnsubscribe = languagesStore.subscribe(value => {
        languages = value;
        console.log(languages, 'store languages');
      });
      const socialMediaUnsubscribe = socialMediaStore.subscribe(value => {
        socialMedia = value;
        console.log(socialMedia, 'socialMedia store values');
      });
      const educationUnsubscribe = educationStore.subscribe(value => {
        educations = value;
        console.log(educations, 'educations store values');
      });
      const projectUnsubscribe = projectsStore.subscribe(value => {
        projects = value;
        console.log(projects, 'projects store values');
      });
      const workExperienceUnsubscribe = workExperienceStore.subscribe(value => {
        workExperience = value;
        console.log(workExperience, 'workExperience store values');
      });
  
      return () => {
        skillsUnsubscribe();
        languagesUnsubscribe();
        basicDetailsUnsubscribe();
        socialMediaUnsubscribe();
        educationUnsubscribe();
        projectUnsubscribe();
        workExperienceUnsubscribe();
      };
    });
  </script>
  
  <section class="m-5 border rounded-lg p-5">
    {#if basicDetails.full_name}
      <section class="w-full gap-5 grid grid-cols-3">
        <div class="col-span-2">
          <h1 class="font-bold">{basicDetails.full_name}</h1>
          <p class="text-blue-600"><em>{basicDetails.desigination}</em></p>
          <p class="text-xs align-bottom flex mt-5">{basicDetails.summary}</p>
        </div>
        {#if basicDetails.imageUrl != ""}
          <div class="flex items-center rounded-lg w-full h-full col-span-1 justify-end">
            <img class="w-28 h-28 object-cover rounded-full" src="{basicDetails.imageUrl}" alt="img" />
          </div>
        {/if}
      </section>
    {/if}
    <hr />
  
    {#if basicDetails.full_name}
      <h3 class="font-bold">Basic details</h3>
      <hr />
      <div class="grid grid-cols-4 my-2">
        <div class="flex gap-2 col-span-2">
          <span><i class="fa-solid fa-envelope text-xs"></i></span>
          <span class="flex text-xs items-center">{basicDetails.email}</span>
        </div>
        <div class="flex gap-2 col-span-2">
          <span><i class="text-xs fa-solid fa-phone"></i></span>
          <span class="text-xs flex items-center">{basicDetails.phone_number}</span>
        </div>
        <div class="col-span-4 flex text-xs">
          <span><i class="fa-solid fa-address-card text-xs pr-2"></i></span>
          {basicDetails.address}, {basicDetails.city}, {basicDetails.state}, {basicDetails.country}, {basicDetails.pinCode}
        </div>
      </div>
    {/if}
    <hr />
  
    <h3 class="font-bold">Language</h3>
    <hr />
    <ul>
      {#each languages as { language, proficiency }, index (index)}
      <section class="mt-2">
        <div class="flex  items-center">
          <li class="text-xs">{language}</li>
          &nbsp; - &nbsp;
          <span class="text-xs">{proficiency}</span>
        </div>
    </section>
      {/each}
    </ul>
    <hr />
  
    <h3 class="font-bold">Skills</h3>
    <ul>
      {#each skills as { skill }, index (index)}
        <li>{skill}</li>
      {/each}
    </ul>
    <hr />
  
    <h3 class="font-bold">Education</h3>
    <hr />
    <ul class="my-2">
      {#each educations as { institution, course, passoutYear, courseName, markScore }, index (index)}
        <div class="flex flex-col font-bold mb-2">
          <li class="text-md">{institution}</li>
          <span class="flex flex-row text-sm text-gray-600">
            <li>{courseName}</li> &nbsp; - &nbsp;
            <li>{course}</li>
          </span>
          <li class="text-xs text-gray-400">{passoutYear}</li>
          <li class="text-xs text-gray-400">{markScore}% marks scored</li>
        </div>
      {/each}
    </ul>
    <hr />
  
    <h3 class="font-bold">Work Experience</h3>
    <hr />
    <ul class="my-2">
      {#each workExperience as { company, designation, joiningDate, endDate, totalWorkExperience }, index (index)}
        <div class="flex flex-col font-bold mb-2">
          <li class="text-md">{company}</li>
          <span class="flex flex-row text-sm text-gray-600">
            <li>{designation}</li> &nbsp; - &nbsp;
            <li>{totalWorkExperience} year work experience</li>
          </span>
          <li class="text-xs text-gray-400">{joiningDate}</li>
          <li class="text-xs text-gray-400">{endDate}</li>
        </div>
      {/each}
    </ul>
    <hr />
    <h3 class="font-bold">Contact Me</h3>
    <hr />
    <!-- <ul>
      {#each socialMedia as { platform, link }, index (index)}
        <li><a href="{link}">{platform}</a></li>
      {/each}
    </ul> -->
  </section>
  