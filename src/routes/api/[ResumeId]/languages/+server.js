// base d req body insert the value
import { e, Language, Resume } from '$lib/server/models/database';
import { json } from '@sveltejs/kit';

export async function POST(event) {
  try {
    // Get user session
    const requestBody = await event.request.json();
    console.log(requestBody, 'reqqqbooodyyyy------------------------------------+++vivi');

    // Extract ResumeId from the URL parameters
    const { ResumeId } = event.params;

    if (Array.isArray(requestBody.Languages)) {
      // Insert new skills
      if(requestBody.Languages[0].id){
        const promises = requestBody.languages.map(async (language) => {
            const updatedLanguage = await e.update(e.Language, () => ({
              filter_single: { id: language.id },
              set: {
                language: language.language || ' ',
                resume: e.select(e.Resume, {
                  filter_single: { id: ResumeId }
                })
              }
            }));
          
            return updatedLanguage.id; // Return the updated ID
          });
          
    
          const insertedIds = await Promise.all(promises);
    
          return json({ msg: 'language updated', insertedIds: insertedIds });
        }
       
else{
      const promises = requestBody.skills.map(async (language) => {
        const insertedLanguage = await Language.insert({
            language: language.language || ' ',
          resume: e.select(e.Resume, {
            filter_single: { id: ResumeId }
          })
        });

        return insertedLanguage.id; // Return the inserted ID
      });

      const insertedIds = await Promise.all(promises);

      return json({ msg: 'Langeage added', insertedIds: insertedIds });
    }
    } else {
      return json({ error: 'Invalid request body' }, { status: 400 });
    }

  } catch (error) {
    console.error('Error processing language:', error);
    return json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
