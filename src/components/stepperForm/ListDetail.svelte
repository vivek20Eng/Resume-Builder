<script>
    import { onMount } from 'svelte';
    import { skillsStore } from "../../lib/stores/skillsStore.js";
  
    let skills = [];
  
    onMount(() => {
      // Subscribe to the store changes
      const unsubscribe = skillsStore.subscribe(value => {
        skills = value;
      });
  
      return () => {
        // Unsubscribe when the component is destroyed
        unsubscribe();
      };
    });
  </script>
  
  <style>
    /* Add your component styling here */
  </style>
  
  <div>
    <h3>List of Skills======</h3>
    <ul>
      {#each skills as { skill }, index (index)}
        <li>{skill}</li>
      {/each}
    </ul>
  </div>
  