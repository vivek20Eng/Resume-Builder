<!-- Your Svelte component -->

<script>
    import { onMount } from 'svelte';
    import { languagesStore } from '../../lib/stores/languagesStore.js';
  
    let newLanguage = {
      language: '',
      proficiency : ''
    };
  
    let languages = [];
    let resumeId;
    let showForm = false;
    let clickedLanguageId; 
    // Variable to store the ID of the clicked language
  
    function toggleForm(languageId) {
      // If the languageId is provided, it means a language is clicked
      if (languageId) {
        clickedLanguageId = languageId;
        const clickedLanguage = languages.find(language => language.id === languageId);
        newLanguage.language = clickedLanguage.language;
      }
      
      showForm = !showForm;
    }
  
    async function addlanguage() {
      if (newLanguage.language.trim() !== '') {
        const languageWithResumeId = {
          language: newLanguage.language,
          resumeId: resumeId
        };
  
        // If a language is clicked, it means we are updating an existing language
        if (clickedLanguageId) {
          languageWithResumeId.id = clickedLanguageId;
        }
  
        // Call API to post languages
        const insertedId = await postlanguages([languageWithResumeId]); // Pass the latest added/updated language
        if (insertedId) {
          // Update the language object with the returned ID
          languageWithResumeId.id = insertedId;
  
          // If a language is clicked, update the existing language in the array
          if (clickedLanguageId) {
            const languageIndex = languages.findIndex(language => language.id === clickedLanguageId);
            languages[languageIndex] = languageWithResumeId;
          } else {
            // If a new language is added, add it to the languages array
            languages = [...languages, languageWithResumeId];
            console.log(languages,"languagesss")
          }
          
          // Update languages store
          languagesStore.set(languages);
        }
        
        // Clear the input
        newLanguage.language = '';
        // Reset the clickedLanguageId
        clickedLanguageId = null;
        // Hide the form after adding/updating a language
        showForm = false;
      }
    }
  
    function removelanguage(index) {
      languages = languages.filter((_, i) => i !== index);
      languagesStore.set(languages);
    }
  
    async function postlanguages(languagesArray) {
      try {
        if (languagesArray.length > 0) {
          const response = await fetch(`/api/${resumeId}/languages`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ languages: languagesArray })
          });

          if (!response.ok) {
            throw new Error('Error posting languages');
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
        console.error('Error posting languages:', error);
        return null;
      }
    }
  
    onMount(() => {
      const unsubscribe = languagesStore.subscribe((value) => {
        languages = value;
      });
  
      const parts = window.location.pathname.split('/');
      resumeId = parts[parts.length - 1];
  
      return () => {
        unsubscribe();
      };
    });
  </script>
  
  <div class="container mx-auto p-4">
    <!-- <h3 class="text-2xl font-semibold mb-4">languages</h3> -->
  
    <button on:click={() => toggleForm(null)} class="border-2 rounded-lg p-2 text-xs w-full text-gray-600">Add language <i class="fa-solid fa-plus"></i></button>
  
    {#if showForm}
      <div class="mt-4">
        <div class="mt-1 flex">
          <input
            type="text"
            id="newLanguage"
            class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            bind:value={newLanguage.language}
          />
          <button class="ml-2 px-4 py-2 bg-green-500 text-white rounded-md" on:click={addlanguage}>Add</button>
        </div>
      </div>
      <!-- proficiency dropdown with real-time validation -->
	<div class="w-full px-3">
        <label class="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2" for="language">
          Proficiency:
        </label>
    
        <select
          name="grid-proficiency"
          id="grid-proficiency"
          class="input-shade appearance-none block w-full text-gray-300 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          bind:value={newLanguage.proficiency}
        >
          <option value="">Select Proficiency</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>
    {/if}
  
    {#if languages.length > 0}
      <!-- <p class="mb-2 text-gray-500">(Resume ID: {resumeId})</p> -->
      <ul class="  mt-2  list-none ">
        {#each languages as { language, id }, index (index)}
          <li class="p-2 flex justify-between rounded-lg bg-gray-600 mb-2 px-5">
            <span class="text-white">{language}</span>
            <section>
            <button class="ml-2 text-red-500" on:click={() => toggleForm(id)}><i class="fa-solid fa-pen-to-square"></i></button>
            <button class="ml-2 text-red-500" on:click={() => removelanguage(index)}><i class="fa-solid fa-xmark"></i></button>
        </section>
     </li>
        {/each}
      </ul>
    {/if}
  </div>
  

