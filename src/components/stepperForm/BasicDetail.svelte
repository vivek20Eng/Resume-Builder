<!-- Your BasicDetailForm.svelte -->

<script>
    import { onMount } from 'svelte';
    import { basicDetailsStore } from '../../lib/stores/basicDetailsStore.js';
  
    let basicDetail = {
      full_name: '',
      email: '',
      phone: '',
      designation: '',
      summary: '',
      avatar_src: ''
    };
  
    let resumeId;
    let showForm = false;
    let clickedBasicDetailId; // Variable to store the ID of the clicked basicDetail
  
    function toggleForm(basicDetailId) {
      // If the basicDetailId is provided, it means a basicDetail is clicked
      if (basicDetailId) {
        clickedBasicDetailId = basicDetailId;
        const clickedBasicDetail = basicDetail.find(basicDetail => basicDetail.id === basicDetailId);
        basicDetail = { ...clickedBasicDetail }; // Update the form fields
      }
  
      showForm = !showForm;
    }
  
    async function addBasicDetail() {
      if (basicDetail.full_name.trim() !== '') {
        const basicDetailWithResumeId = {
          ...basicDetail,
          resumeId: resumeId
        };
  
        // If a basicDetail is clicked, it means we are updating an existing basicDetail
        if (clickedBasicDetailId) {
          basicDetailWithResumeId.id = clickedBasicDetailId;
        }
  
        // Call API to post basicDetail
        const insertedId = await postBasicDetail([basicDetailWithResumeId]); // Pass the latest added/updated basicDetail
        if (insertedId) {
          // Update the basicDetail object with the returned ID
          basicDetailWithResumeId.id = insertedId;
  
          // If a basicDetail is clicked, update the existing basicDetail in the array
          if (clickedBasicDetailId) {
            const basicDetailIndex = basicDetail.findIndex(basicDetail => basicDetail.id === clickedBasicDetailId);
            basicDetail[basicDetailIndex] = basicDetailWithResumeId;
          } else {
            // If a new basicDetail is added, add it to the basicDetail array
            basicDetail = [...basicDetail, basicDetailWithResumeId];
          }
  
          // Update basicDetail store
          basicDetailsStore.set(basicDetail);
        }
  
        // Clear the input
        basicDetail = {
          full_name: '',
          email: '',
          phone: '',
          designation: '',
          summary: '',
          avatar_src: ''
        };
  
        // Reset the clickedBasicDetailId
        clickedBasicDetailId = null;
        // Hide the form after adding/updating a basicDetail
        showForm = false;
      }
    }
  
    function removeBasicDetail(index) {
      basicDetail = basicDetail.filter((_, i) => i !== index);
      basicDetailsStore.set(basicDetail);
    }
  
    async function postBasicDetail(basicDetailArray) {
      try {
        if (basicDetailArray.length > 0) {
          const response = await fetch(`/api/${resumeId}/basic-details`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ basicDetail: basicDetailArray })
          });
  
          if (!response.ok) {
            throw new Error('Error posting basicDetail');
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
        console.error('Error posting basicDetail:', error);
        return null;
      }
    }
  
    onMount(() => {
      const unsubscribe = basicDetailsStore.subscribe((value) => {
        basicDetail = value;
      });
  
      const parts = window.location.pathname.split('/');
      resumeId = parts[parts.length - 1];
  
      return () => {
        unsubscribe();
      };
    });
  </script>
  
  <div class="container mx-auto p-4">
    <button on:click={() => toggleForm(null)} class="border-2 rounded-lg p-2 text-xs w-full text-gray-600">Add Basic Detail <i class="fa-solid fa-plus"></i></button>
  
    {#if basicDetail.length > 0}
      <ul class="mt-2 list-none">
        {#each basicDetail as { full_name, id }, index (index)}
          <li class="p-2 flex justify-between rounded-lg bg-gray-600 mb-2 px-5">
            <span class="text-white">{full_name}</span>
            <section>
              <button class="ml-2 text-red-500" on:click={() => toggleForm(id)}><i class="fa-solid fa-pen-to-square"></i></button>
              <button class="ml-2 text-red-500" on:click={() => removeBasicDetail(index)}><i class="fa-solid fa-xmark"></i></button>
            </section>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
  
  {#if showForm}
    <!-- Your input fields for basic details -->
    <div class="container mx-auto p-4">
      <h3 class="text-2xl font-semibold mb-4">Basic Details</h3>
  
      <div class="mt-4">
        <div class="mt-1 flex">
          <label for="full_name">Full Name:</label>
          <input
            type="text"
            id="full_name"
            class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            bind:value={basicDetail.full_name}
          />
        </div>
  
        <div class="mt-1 flex">
          <label for="email">Email:</label>
          <input
            type="text"
            id="email"
            class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            bind:value={basicDetail.email}
          />
        </div>
  
        <!-- Repeat similar structure for other input fields -->
  
        <button class="mt-2 px-4 py-2 bg-green-500 text-white rounded-md" on:click={addBasicDetail}>Save</button>
      </div>
    </div>
  {/if}
  
  <!-- Display Basic Details -->
  <div class="container mx-auto p-4">
    {#if basicDetail.length > 0}
      <h3 class="text-2xl font-semibold mb-4">Basic Details Display</h3>
      <ul class="mt-2 list-none">
        {#each basicDetail as { full_name, id }, index (index)}
          <li class="p-2 flex justify-between rounded-lg bg-gray-600 mb-2 px-5">
            <span class="text-white">{full_name}</span>
            <section>
              <!-- You can add any other display elements or actions here -->
            </section>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
  
  <style>
    /* Add your component styling here */
  </style>
  