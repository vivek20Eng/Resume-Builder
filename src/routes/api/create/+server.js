import { Resume } from '$lib/server/models/database';
import { json } from '@sveltejs/kit';

export async function POST(event) {
	try {
		// Get user session
		const requestBody = await event.request.json();

		// Extract the selected theme and resume name from the parsed data
		const selectedTheme = requestBody.selectedTheme;
		const resumeName = requestBody.resumeName;

		// Insert BasicDetails
		const resumeResult = await Resume.insert({
			resume_theme: selectedTheme ? `${selectedTheme}` : 'dummy theme',
			resume_name: resumeName ? `${resumeName}` : 'dummy resume'
		});

		// Assuming resumeResult contains the ID of the created resume
		const resumeId = resumeResult.id;

		return json({
			resumeResult,
			redirect: `/editor/resume/${resumeId}`

			// status: 200,
			// body: JSON.stringify({
			//     message: 'Resume created successfully',
			//     redirect: `/editor/resume/${resumeId}`,
			// }),
		});
	} catch (error) {
		console.error('Error processing request:', error);

		// Return an error response
		return {
			status: 500,
			body: JSON.stringify({ error: 'Internal Server Error' })
		};
	}
}
