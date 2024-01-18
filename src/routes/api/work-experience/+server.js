import { e, WorkExperience, Resume } from '$lib/server/models/database';
import { json } from '@sveltejs/kit';


export async function POST(event) {
  // Get user session
  const requestBody = await event.request.json();
  console.log(requestBody, "reqqqbooodyyyy------------------------------------+++vivi");

  // Work experience
  const workExperienceResult = await WorkExperience.insert({
    company: requestBody.company || ' ',
    designation: requestBody.designation || ' ',
    joining_date: requestBody.joiningDate || ' ',
    worked_till: requestBody.endDate || ' ',
    total_experience: requestBody.totalWorkExperience || ' ',
    resume: e.select(e.Resume, {
      filter_single: { id: requestBody.resumeId }
    })
  });

  return json({ msg: "work Experience added", workExperienceResult });
}



