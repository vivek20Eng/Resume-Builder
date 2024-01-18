import { e, Skill, Resume } from '$lib/server/models/database';
import { json } from '@sveltejs/kit';

export async function POST(event) {
	// Get user session
	const requestBody = await event.request.json();
	console.log(requestBody, 'reqqqbooodyyyy------------------------------------+++vivi');

	if (requestBody.skillId) {
		// Update existing skill
		const updatedSkillResult = await Skill.update({
			set: { skill: requestBody.skill || ' ' },
			where: { id: requestBody.skillId }
		});

		return json({ msg: 'Skill updated', skillResult: updatedSkillResult });
	} else {
		// Insert new skill
		const newSkillResult = await Skill.insert({
			skill: requestBody.skill || ' ',
			resume: e.select(e.Resume, {
				filter_single: { id: requestBody.resumeId }
			})
		});

		return json({ msg: 'Skill added', skillResult: newSkillResult });
	}
}
