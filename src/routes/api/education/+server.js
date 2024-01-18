import { e,  Education,  Resume } from '$lib/server/models/database';
import { json } from '@sveltejs/kit';

export async function POST(event) {
  // Get user session
  const requestBody = await event.request.json();
  console.log(requestBody, "reqqqbooodyyyy------------------------------------");

  // Insert Education
  const educationResult = await Education.insert({
    institution: requestBody.institution || ' ',
    course: requestBody.course || ' ',
    passout_year: requestBody.passoutYear || '',
    specialization: requestBody.courseName || ' ',
    marks: requestBody.markScore || ' ',
    resume: e.select(e.Resume, {
        filter_single: { id: requestBody.resumeId }
      })
  });
  
  // Add more logic for other data inserts if needed

  return json({ educationResult });
}
