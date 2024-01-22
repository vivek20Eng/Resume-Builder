<!-- Your Svelte component -->

<script>
    import { onMount } from 'svelte';
    import { skillsStore } from '../../lib/stores/skillsStore.js';
  
    let newSkill = {
      skill: ''
    };
  
    let skills = [];
    let resumeId;
    let showForm = false;
    let clickedSkillId; // Variable to store the ID of the clicked skill
  
    function toggleForm(skillId) {
      // If the skillId is provided, it means a skill is clicked
      if (skillId) {
        clickedSkillId = skillId;
        const clickedSkill = skills.find(skill => skill.id === skillId);
        newSkill.skill = clickedSkill.skill;
      }
      
      showForm = !showForm;
    }
  
    async function addSkill() {
      if (newSkill.skill.trim() !== '') {
        const skillWithResumeId = {
          skill: newSkill.skill,
          resumeId: resumeId
        };
  
        // If a skill is clicked, it means we are updating an existing skill
        if (clickedSkillId) {
          skillWithResumeId.id = clickedSkillId;
        }
  
        // Call API to post skills
        const insertedId = await postSkills([skillWithResumeId]); // Pass the latest added/updated skill
        if (insertedId) {
          // Update the skill object with the returned ID
          skillWithResumeId.id = insertedId;
  
          // If a skill is clicked, update the existing skill in the array
          if (clickedSkillId) {
            const skillIndex = skills.findIndex(skill => skill.id === clickedSkillId);
            skills[skillIndex] = skillWithResumeId;
          } else {
            // If a new skill is added, add it to the skills array
            skills = [...skills, skillWithResumeId];
          }
          
          // Update skills store
          skillsStore.set(skills);
        }
        
        // Clear the input
        newSkill.skill = '';
        // Reset the clickedSkillId
        clickedSkillId = null;
        // Hide the form after adding/updating a skill
        showForm = false;
      }
    }
  
    function removeSkill(index) {
      skills = skills.filter((_, i) => i !== index);
      skillsStore.set(skills);
    }
  
    async function postSkills(skillsArray) {
      try {
        if (skillsArray.length > 0) {
          const response = await fetch(`/api/${resumeId}/skills`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ skills: skillsArray })
          });

          if (!response.ok) {
            throw new Error('Error posting skills');
          }

          const data = await response.json();
          console.log(data);

          // Assuming the server returns an array of inserted IDs
          if (data.insertedIds && data.insertedIds.length > 0) {
            return data.insertedIds[0]; // Return the first ID
          } else {
            console.warn('No inserted ID returned from the server');
            return null;
          }
        }
      } catch (error) {
        console.error('Error posting skills:', error);
        return null;
      }
    }
  
    onMount(() => {
      const unsubscribe = skillsStore.subscribe((value) => {
        skills = value;
      });
  
      const parts = window.location.pathname.split('/');
      resumeId = parts[parts.length - 1];
  
      return () => {
        unsubscribe();
      };
    });
  </script>
  
  <div class="container mx-auto p-4">
    <!-- <h3 class="text-2xl font-semibold mb-4">Skills</h3> -->
  
    <button on:click={() => toggleForm(null)} class="border-2 rounded-lg p-2 text-xs w-full text-gray-600">Add skill <i class="fa-solid fa-plus"></i></button>
  
    {#if showForm}
      <div class="mt-4">
        <div class="mt-1 flex">
          <input
            type="text"
            id="newSkill"
            class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            bind:value={newSkill.skill}
          />
          <button class="ml-2 px-4 py-2 bg-green-500 text-white rounded-md" on:click={addSkill}>Add</button>
        </div>
      </div>
    {/if}
  
    {#if skills.length > 0}
      <!-- <p class="mb-2 text-gray-500">(Resume ID: {resumeId})</p> -->
      <ul class="  mt-2  list-none ">
        {#each skills as { skill, id }, index (index)}
          <li class="p-2 flex justify-between rounded-lg bg-gray-600 mb-2 px-5">
            <span class="text-white">{skill}</span>
            <section>
            <button class="ml-2 text-red-500" on:click={() => toggleForm(id)}><i class="fa-solid fa-pen-to-square"></i></button>
            <button class="ml-2 text-red-500" on:click={() => removeSkill(index)}><i class="fa-solid fa-xmark"></i></button>
        </section>
     </li>
        {/each}
      </ul>
    {/if}
  </div>
  
  <style>
    /* Add your component styling here */
  </style>
