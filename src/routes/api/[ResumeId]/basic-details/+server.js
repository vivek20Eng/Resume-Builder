import { e, BasicDetails, Address } from '$lib/server/models/database';
import { json } from '@sveltejs/kit';

export async function POST(event) {
  try {
    // Get user session
    const requestBody = await event.request.json();
    console.log(requestBody, 'Request Body');

    // Assuming you have the resumeId available in the requestBody
    const { resumeId } = requestBody;

    // Insert BasicDetails
    const basicDetailsResult = await BasicDetails.insert({
      full_name: requestBody.full_name || ' ',
      email: requestBody.email || ' ',
      phone: requestBody.phone || ' ',
      designation: requestBody.designation || ' ',
      summary: requestBody.summary || ' ',
      avatar_src: requestBody.avatar_src || ' ',
      resume: e.select(e.Resume, {
        filter_single: { id: resumeId }
      })
    });

    // Assuming you have an ID property in your result objects, you can use it
    // to send back the ID of the inserted data
    return json({
      basicDetail: [
        {
          ...requestBody,
          resumeId: resumeId,
          id: basicDetailsResult.id // Assuming you have an ID property in your BasicDetails model
        }
      ]
    });
  } catch (error) {
    console.error('Error processing basic details:', error);
    return json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
