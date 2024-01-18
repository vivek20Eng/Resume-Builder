import { e, Project , Resume } from '$lib/server/models/database';
import { json } from '@sveltejs/kit';

export async function POST(event) {
  // Get user session
  const requestBody = await event.request.json();
  console.log(requestBody, "reqqqbooodyyyy------------------------------------+++vivi");

  // Insert project
  const projectResult = await Project.insert({
    title: requestBody.projectTitle || ' ',
    description: requestBody.projectDescription || ' ',
    start_date: requestBody.startDate || ' ',
    end_date: requestBody.endDate || ' ',
    resume: e.select(e.Resume, {
        filter_single: { id: requestBody.resumeId }
      })
  });

  return json({ msg: "project added", projectResult });
}
