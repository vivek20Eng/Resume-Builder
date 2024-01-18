import { e, Language, Resume } from '$lib/server/models/database';
import { json } from '@sveltejs/kit';

export async function POST(event) {
	// Get user session
	const requestBody = await event.request.json();
	console.log(requestBody, 'reqqqbooodyyyy------------------------------------+++vivi');

	// Insert project
	const languageResult = await Language.insert({
		language: requestBody.language || ' ',
		proficiency: requestBody.proficiency || ' ',

		resume: e.select(e.Resume, {
			filter_single: { id: requestBody.resumeId }
		})
	});

	return json({ msg: 'language added', languageResult });
}
