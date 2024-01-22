<script>
	import { onMount } from 'svelte';
	import { skillsStore } from '../../lib/stores/skillsStore.js';
	import { languagesStore } from '../../lib/stores/languagesStore.js';
	import { basicDetailsStore } from '../../lib/stores/basicDetailsStore.js';
    import {socialMediaStore} from '../../lib/stores/socialMediaStore.js';
	let skills = [];
	let languages = [];
	let basicDetails = [];
    let socialMedia = [];
	onMount(() => {
		// Subscribe to the store changes
		const skillsUnsubscribe = skillsStore.subscribe((value) => {
			skills = value;
            console.log(skills,"store skills,-------")
		});
		const basicDetailsUnsubscribe = basicDetailsStore.subscribe((value) => {
			basicDetails = value;
			console.log(basicDetails, 'this is sores values  23456789iuhbvn');
		});
		const languagesUnsubscribe = languagesStore.subscribe((value) => {
			languages = value;
            console.log(languages,"store languages")
		});
        const socialMediaUnsubscribe = socialMediaStore.subscribe((value)=>{
            socialMedia = value;
            console.log(socialMedia,"social media--- sores")
        })
        
       
		return () => {
			// Unsubscribe when the component is destroyed
			skillsUnsubscribe();
			languagesUnsubscribe();
			basicDetailsUnsubscribe();
            socialMediaUnsubscribe();
		};
	});
</script>

<section class="m-5 border rounded-lg p-5">
	<div class="mb-5">
		{#if basicDetails.full_name}
			<section class=" w-full gap-5 grid grid-cols-3 ">
				<div class="col-span-2"
					><h1 class="font-bold">{basicDetails.full_name}</h1>

					<p class="text-blue-600">
						<em>{basicDetails.desigination}</em>
					</p>
					<p class="text-xs align-bottom flex  mt-5">
						{basicDetails.summary}
                    </p>
				</div>
                {#if basicDetails.imageUrl != ""}

				<div class="flex items-center rounded-lg w-full h-full col-span-1 justify-end"
					><img
						class="w-28 h-28  object-cover rounded-full"
						src="{basicDetails.imageUrl}"
						alt="img"
					/>
                    </div
				>
                {/if}
			</section>
		{/if}
        </div>
    <hr />
    {#if basicDetails.full_name}

	<h3 class="font-bold">Basic details</h3>
    <hr/>
	<div class="grid grid-cols-4  my-2">
        <div class="flex gap-2 col-span-2"><span><i class="fa-solid fa-envelope text-xs"></i></span> <span class="flex text-xs items-center">{basicDetails.email} </span></div>
        <div class="flex gap-2 col-span-2"> <span> <i class="text-xs fa-solid fa-phone"></i></span> <span class="text-xs flex items-center">{basicDetails.phone_number} </span></div>
        <div class="col-span-4 flex text-xs"><span><i class="fa-solid fa-address-card text-xs pr-2"></i></span> {basicDetails.address}, {basicDetails.city}, {basicDetails.state}, {basicDetails.country}, {basicDetails.pinCode}</div>
        
      </div>
    {/if}
	<hr />
	
	<h3 class="font-bold">Language</h3>
    <hr />

	<ul class="">
		{#each languages as { language,proficiency }, index (index)}
			<div class="flex"><li>{language}</li>&nbsp - &nbsp<span>{proficiency}</span></div>
		{/each}
	</ul>
	<hr />
	

	<h3 class="font-bold">Skills<br /></h3>
	<ul>
		{#each skills as { skill }, index (index)}
			<li>{skill}</li>
		{/each}
	</ul>
	

	

	<hr />
	<h3 class="font-bold">Contact Me</h3>
    <hr />
	<ul>
		<li><a href="">Twitter</a></li>
		<li><a href="">Medium</a></li>
		<li><a href="">Linkedin</a></li>
		<li><a href="">Gmail</a></li>
	</ul>
</section>
