// base d req body insert the value
import { e, Skill, Resume } from '$lib/server/models/database';
import { json } from '@sveltejs/kit';

export async function POST(event) {
  try {
    // Get user session
    const requestBody = await event.request.json();
    console.log(requestBody, 'reqqqbooodyyyy------------------------------------+++vivi');

    // Extract ResumeId from the URL parameters
    const { ResumeId } = event.params;

    if (Array.isArray(requestBody.skills)) {
      // Insert new skills
      if(requestBody.skills[0].id){
        const promises = requestBody.skills.map(async (skill) => {
            const updatedSkill = await e.update(e.Skill, () => ({
              filter_single: { id: skill.id },
              set: {
                skill: skill.skill || ' ',
                resume: e.select(e.Resume, {
                  filter_single: { id: ResumeId }
                })
              }
            }));
          
            return updatedSkill.id; // Return the updated ID
          });
          
    
          const insertedIds = await Promise.all(promises);
    
          return json({ msg: 'Skills updated', insertedIds: insertedIds });
        }
       
else{
      const promises = requestBody.skills.map(async (skill) => {
        const insertedSkill = await Skill.insert({
          skill: skill.skill || ' ',
          resume: e.select(e.Resume, {
            filter_single: { id: ResumeId }
          })
        });

        return insertedSkill.id; // Return the inserted ID
      });

      const insertedIds = await Promise.all(promises);

      return json({ msg: 'Skills added', insertedIds: insertedIds });
    }
    } else {
      return json({ error: 'Invalid request body' }, { status: 400 });
    }

  } catch (error) {
    console.error('Error processing skills:', error);
    return json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
