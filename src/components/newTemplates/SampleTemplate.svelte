<script>
    import { onMount } from 'svelte';
    import { skillsStore } from '../../lib/stores/skillsStore.js';
    import { languagesStore } from '../../lib/stores/languagesStore.js';
    import { basicDetailsStore } from '../../lib/stores/basicDetailsStore.js';
    import { socialMediaStore } from '../../lib/stores/socialMediaStore.js';
    import { educationStore } from '../../lib/stores/educationStore.js';
    import { projectsStore } from '../../lib/stores/projectsStore.js';
    import { workExperienceStore } from '../../lib/stores/workExperienceStore.js';

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
        });

        const basicDetailsUnsubscribe = basicDetailsStore.subscribe(value => {
            basicDetails = value;
        });

        const languagesUnsubscribe = languagesStore.subscribe(value => {
            languages = value;
        });

        const socialMediaUnsubscribe = socialMediaStore.subscribe(value => {
            socialMedia = value;
        });

        const educationUnsubscribe = educationStore.subscribe(value => {
            educations = value;
        });

        const projectUnsubscribe = projectsStore.subscribe(value => {
            projects = value;
        });

        const workExperienceUnsubscribe = workExperienceStore.subscribe(value => {
            workExperience = value;
        });

        return () => {
            skillsUnsubscribe();
            basicDetailsUnsubscribe();
            languagesUnsubscribe();
            socialMediaUnsubscribe();
            educationUnsubscribe();
            projectUnsubscribe();
            workExperienceUnsubscribe();
        };
    });
</script>

<section class="m-5 border rounded-lg p-5 bg-gray-100">
    {#if basicDetails.full_name}
    <section class="w-full gap-5 grid grid-cols-3 items-center">
        <div class="col-span-2">
            <h1 class="font-bold text-3xl text-indigo-800">{basicDetails.full_name}</h1>
            <p class="text-blue-600"><em>{basicDetails.desigination}</em></p>
            <p class="text-sm mt-3 text-gray-700">{basicDetails.summary}</p>
        </div>
        {#if basicDetails.imageUrl != ""}
        <div class="flex items-center justify-end">
            <img class="w-28 h-28 object-cover rounded-full" src="{basicDetails.imageUrl}" alt="img" />
        </div>
        {/if}
    </section>
    {/if}
    <hr class="my-5" />

    {#if basicDetails.full_name}
    <h3 class="font-bold text-xl mb-2 text-indigo-800">
        <i class="fas fa-info-circle mr-2"></i> Basic details
    </h3>
    <hr class="mb-5" />
    <div class="grid grid-cols-4 my-2 text-sm">
        <div class="flex gap-2 col-span-2 items-center">
            <span><i class="fas fa-envelope text-gray-600"></i></span>
            <span class="flex items-center">{basicDetails.email}</span>
        </div>
        <div class="flex gap-2 col-span-2 items-center">
            <span><i class="fas fa-phone text-gray-600"></i></span>
            <span class="flex items-center">{basicDetails.phone_number}</span>
        </div>
        <div class="col-span-4 flex items-center">
            <span><i class="fas fa-address-card text-gray-600 pr-2"></i></span>
            {basicDetails.address}, {basicDetails.city}, {basicDetails.state}, {basicDetails.country}, {basicDetails.pinCode}
        </div>
    </div>
    <hr class="my-5" />
    {/if}

    <h3 class="font-bold text-xl mb-2 text-indigo-800">
        <i class="fas fa-graduation-cap mr-2"></i> Education
    </h3>
    <hr class="mb-5" />
    <ul class="text-sm">
        {#each educations as { institution, course, passoutYear, courseName, markScore }, index (index)}
        <li class="mb-2">
            <span class="font-semibold text-gray-800">
                <i class="fas fa-university mr-2"></i> {institution}
            </span><br>
            <span class="text-gray-600">{courseName} - {course}</span><br>
            <span class="text-gray-400">{passoutYear}</span><br>
            <span class="text-gray-400">{markScore}% marks scored</span>
        </li>
        {/each}
    </ul>
    <hr class="my-5" />

    <h3 class="font-bold text-xl mb-2 text-indigo-800">
        <i class="fas fa-briefcase mr-2"></i> Work Experience
    </h3>
    <hr class="mb-5" />
    <ul class="text-sm">
        {#each workExperience as { company, designation, joiningDate, endDate, totalWorkExperience }, index (index)}
        <li class="mb-2">
            <span class="font-semibold text-gray-800">
                <i class="fas fa-building mr-2"></i> {company}
            </span><br>
            <span class="text-gray-600">{designation} - {totalWorkExperience} years</span><br>
            <span class="text-gray-400">{joiningDate} - {endDate}</span>
        </li>
        {/each}
    </ul>
    <hr class="my-5" />
    <h3 class="font-bold text-xl mb-2 text-indigo-800">
        <i class="fas fa-project-diagram mr-2"></i> Projects
    </h3>
    <hr class="mb-5" />
    <ul class="text-sm">
        {#each projects as { projectTitle, projectDescription, startDate, endDate }, index (index)}
        <li class="mb-2">
            <span class="font-semibold text-gray-800">
                <i class="fas fa-tasks mr-2"></i> {projectTitle}
            </span><br>
            <span class="text-gray-600">{projectDescription}</span><br>
            <span class="text-gray-400">{startDate} - {endDate}</span>
        </li>
        {/each}
    </ul>
    <hr class="my-5" />
    <h3 class="font-bold text-xl mb-2 text-indigo-800">
        <i class="fas fa-language mr-2"></i> Language
    </h3>
    <hr class="mb-5" />
    <ul class="text-sm">
        {#each languages as { language, proficiency }, index (index)}
        <li class="mb-1">
            <span class="font-semibold text-gray-800">{language}</span> - {proficiency}
        </li>
        {/each}
    </ul>

    <h3 class="font-bold text-xl mb-2 text-indigo-800">
        <i class="fas fa-code mr-2"></i> Skills
    </h3>
    <hr class="mb-2" />
    <ul class="text-sm list-disc ml-6 mt-2">
        {#each skills as { skill }, index (index)}
        <li class="mb-1 text-gray-800">{skill}</li>
        {/each}
    </ul>
    <hr class="my-5" />

    <h3 class="font-bold text-xl mb-2 text-indigo-800">
        <i class="fas fa-address-book mr-2"></i> Contact Me
    </h3>
    <hr class="my-5" />
</section>
