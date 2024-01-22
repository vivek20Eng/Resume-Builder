import { e, Resume } from '$lib/server/models/database';
import { json } from '@sveltejs/kit';

export async function POST(event) {
	// Get user session
	const requestBody = await event.request.json();
	console.log(requestBody, 'reqqqbooodyyyy------------------------------------+++vivi sirrrr');

	const {
		resumeId,
		workExperienceInformation,
		addressInformation,
		educationInformation,
		languageInformation,
		skillInformation,
		projectInformation,
		socialMediaInformation
	} = requestBody;

	// Prepare the update object
	const updateObject = {
		filter_single: { id: resumeId },
		set: {}
	};

	// Conditionally include projects if projectInformation is a valid UUID
	if (projectInformation && typeof projectInformation === 'string') {
		updateObject.set.projects = e.select(e.Project, (project) => ({
			filter_single: { id: projectInformation }
		}));
	}

	// Conditionally include basic_details if basicInformation is a valid UUID
	if (
		addressInformation.basicInformationResult &&
		typeof addressInformation.basicInformationResult.id === 'string'
	) {
		updateObject.set.basic_details = e.select(e.BasicDetails, (basicDetails) => ({
			filter_single: { id: addressInformation.basicInformationResult.id }
		}));
	}

	// Conditionally include address if addressInformation is a valid UUID
	if (addressInformation.addressResult && typeof addressInformation.addressResult.id === 'string') {
		updateObject.set.addresses = e.select(e.Address, (address) => ({
			filter_single: { id: addressInformation.addressResult.id }
		}));
	}

	// Conditionally include education if educationInformation is a valid UUID
	if (educationInformation && typeof educationInformation === 'string') {
		updateObject.set.educations = e.select(e.Education, (education) => ({
			filter_single: { id: educationInformation }
		}));
	}

	// Conditionally include language if languageInformation is a valid UUID
	if (languageInformation && typeof languageInformation === 'string') {
		updateObject.set.languages = e.select(e.Language, (language) => ({
			filter_single: { id: languageInformation }
		}));
	}

	// Conditionally include skill if skillInformation is a valid UUID
	if (skillInformation && typeof skillInformation === 'string') {
		updateObject.set.skills = e.select(e.Skill, (skill) => ({
			filter_single: { id: skillInformation }
		}));
	}

	// Conditionally include workExperience if workExperienceInformation is a valid UUID
	if (workExperienceInformation && typeof workExperienceInformation === 'string') {
		updateObject.set.work_experiences = e.select(e.WorkExperience, (workExperience) => ({
			filter_single: { id: workExperienceInformation }
		}));
	}

	// Conditionally include socialMedia if socialMediaInformation is a valid UUID
	if (socialMediaInformation && typeof socialMediaInformation === 'string') {
		updateObject.set.social_media = e.select(e.SocialMedia, (socialMedia) => ({
			filter_single: { id: socialMediaInformation }
		}));
	}

	// Perform the resume update
	await Resume.update(() => updateObject);

	const updatedResume = e.select(e.Resume, (resume) => ({
		id: true,
		resume_name: true,
		filter_single: { id: resumeId }
	}));

	console.log(updatedResume.toEdgeQL(), 'sdfsfsdfd-----------------------------');

	// Perform the resume update
	const resumeUpdate = await Resume.update(() => updateObject);
	const redirect = `/preview/${resumeId}/resumeId`;
	return json({ redirect, resumeUpdate });
}
