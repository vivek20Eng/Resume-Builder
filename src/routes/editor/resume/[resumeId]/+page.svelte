<script>
	import SampleTemplate from "../../../../components/newTemplates/SampleTemplate.svelte";
import DetailMainForm from "../../../../components/resumeForms/DetailMainForm.svelte";
	import ListDetail from "../../../../components/stepperForm/ListDetail.svelte";
	import MainStepperForm from "../../../../components/stepperForm/MainStepperForm.svelte";
	import RightNavMenu from "../../../../components/stepperForm/RightNavMenu.svelte";

</script>
			
<!-- <DetailMainForm/> -->


<div class="grid grid-cols-12 gap-4">
	<div class="col-span-2">
		<RightNavMenu/>
	</div>
<!-- ... -->
<div class="col-span-6">
	<MainStepperForm />

</div>
	<div class="col-span-4 border-l-2 w-full">
		<!-- <ListDetail/> -->
		<SampleTemplate/>
	</div>
	
  </div>