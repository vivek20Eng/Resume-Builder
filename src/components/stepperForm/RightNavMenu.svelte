<script>


const formHeading = [
  { label: "Basic Detail", icon: "fa-user" },
  { label: "Education", icon: "fa-graduation-cap" },
  { label: "Skill", icon: "fa-cogs" },
  { label: "Work Experience", icon: "fa-briefcase" },
  { label: "Language", icon: "fa-language" }
];
</script>

 <aside id="sidebar-multi-level-sidebar" class="shadow-lg fixed top-0 left-0 z-40 w-72 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
    <div class="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-200/30 border-r">
       <ul class="space-y-2 font-medium">
          <!-- <li>
             <a href="#" class="flex items-center p-2 text-white rounded-lg  hover:bg-gray-100 dark:hover:bg-gray-700 group">
                <svg class="w-5 h-5 text-white transition duration-75  group-hover:text-white dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 21">
                   <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z"/>
                   <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z"/>
                </svg>
                <span class="ms-3">Resume </span>
             </a>
          </li> -->
         
         
         {#each formHeading as heading}
          <li>
             <a href="#" class="flex items-center p-2 text-gray-400 hover:text-white rounded-lg  hover:bg-white dark:hover:bg-gray-700 group">
               <i class="fa {heading.icon}"></i>
                <span class="flex-1 ms-3 whitespace-nowrap">{heading.label}</span>
             </a>
          </li>
          {/each}
          
         
          
       </ul>
    </div>
 </aside>
 
 
 