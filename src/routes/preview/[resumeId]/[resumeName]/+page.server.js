import { e, Resume } from '$lib/server/models/database';

/** @type {import('@sveltejs/kit').PageServerLoad} */
export async function load({ params }) {
	const { resumeId } = params;
	console.log(resumeId, 'sdfsdfsff---');

	try {
		const resumeResult = await Resume.select((resume) => ({
			id: true,
			resume_name: true,
			addresses: {
				id: true,
				state: true,
				postal_code: true,
				address: true,
				city: true,
				country: true,
				current_location: true
			},
			basic_details: {
				id: true,
				designation: true,
				email: true,
				full_name: true,
				phone: true,
				summary: true,
				avatar_src: true
			},
			educations: {
				id: true,
				course: true,
				institution: true,
				marks: true,
				passout_year: true,
				specialization: true
			},
			projects: {
				id: true,
				description: true,
				start_date: true,
				end_date: true,
				title: true
			},
			languages: {
				id: true,
				language: true,
				proficiency: true
			},
			work_experiences: {
				id: true,
				company: true,
				designation: true,
				joining_date: true,
				total_experience: true,
				worked_till: true
			},
			skills: {
				id: true,
				skill: true
			},
			social_media: {
				id: true,
				platform: true,
				url: true
			},
			filter_single: { id: resumeId }
		}));

		console.log(resumeResult, '+++++++  8 +++++++');

		return {
			status: 200,
			body: {
				resume: resumeResult
			}
		};
	} catch (error) {
		console.error('Error fetching resume data:', error);

		return {
			status: 500,
			body: {
				error: 'Internal Server Error'
			}
		};
	}
}
