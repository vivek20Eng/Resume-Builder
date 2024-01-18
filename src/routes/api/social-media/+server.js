import { e, SocialMedia, Resume } from '$lib/server/models/database';
import { json } from '@sveltejs/kit';

export async function POST(event) {
	try {
	  // Get user session
	  const requestBody = await event.request.json();
	  console.log(requestBody, 'reqqqbooodyyyy------------------------------------+++vivi');
	  const platformValue = requestBody.platform || 'default_value';
	  console.log('Platform Value:', platformValue);
	  if (requestBody.id !== undefined && requestBody.id !== null) {
		// Update existing social media entry
		const socialMediaUpdateResult = await SocialMedia.update({
		  where: { id: requestBody.id },
		  set: {
			platform: requestBody.platform || ' ',
			url: requestBody.url || ' ',
		  },
		});
  
		return json({ msg: 'social media updated', socialMediaResult: socialMediaUpdateResult });
	  } else {
		// Insert new social media entry
		

// Insert new social media entry
const socialMediaResult = await SocialMedia.insert({
  platform: platformValue,
  url: requestBody.url || ' ',
  resume: e.select(e.Resume, {
    filter_single: { id: requestBody.resumeId }
  }),
});

return json({ msg: 'social media added', socialMediaResult });

		  
  
	  }
	} catch (error) {
	  console.error('Error:', error);
	  return json({ error: 'An error occurred while processing the request.' });
	}
  }
  