
<script>
   import { selectedMenu } from '../../lib/stores/StepStore.js';
 
   const formHeading = [
     { label: "Basic Information", icon: "fa-user" },
     { label: "Education", icon: "fa-graduation-cap" },
     { label: "Project", icon: "fa-diagram-project" },
     { label: "Work Experience", icon: "fa-briefcase" },
     { label: "Skill", icon: "fa-cogs" },
     { label: "Social Media", icon: "fa-hashtag" },
     { label: "Language", icon: "fa-language" },
     { label: "Resume", icon: "fa-user-tie" }
   ];
 
   $: console.log('Selected Menu:', $selectedMenu);
 </script>
 
 <aside
   id="sidebar-multi-level-sidebar"
   class="shadow-lg fixed top-0 left-0 z-40 w-72 h-screen transform -translate-x-full sm:translate-x-0 bg-white dark:bg-gray-800/10 overflow-y-auto"
   aria-label="Sidebar"
 >
   <div class="h-full px-3 py-4">
     <ul class="space-y-2 font-medium">
       {#each formHeading as heading, index (index)}
         <li>
           <div
             class="flex cursor-pointer items-center p-2 text-gray-900 hover:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-sky-600 group transition duration-300 ease-in-out"
             class:selected={index + 1 === $selectedMenu}
             on:click={() => $selectedMenu = index + 1}
           >
             <i class="fa {heading.icon} text-xl"></i>
             <span class="flex-1 ms-3 whitespace-nowrap">{heading.label}</span>
           </div>
         </li>
       {/each}
     </ul>
   </div>
 </aside>
 

 