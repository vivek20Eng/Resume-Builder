// import { e, Project , Resume } from '$lib/server/models/database';
// import { json } from '@sveltejs/kit';

// export async function POST(event) {
//   // Get user session
//   const requestBody = await event.request.json();
//   console.log(requestBody, "reqqqbooodyyyy------------------------------------+++vivi");

//   // Insert project
//   const projectResult = await Project.insert({
//     title: requestBody.projectTitle || ' ',
//     description: requestBody.projectDescription || ' ',
//     start_date: requestBody.startDate || ' ',
//     end_date: requestBody.endDate || ' ',
//     resume: e.select(e.Resume, {
//         filter_single: { id: requestBody.resumeId }
//       })
//   });

//   return json({ msg: "project added", projectResult });
// }
import { e, Project, Resume } from '$lib/server/models/database';
import { json } from '@sveltejs/kit';

export async function POST(event) {
    try {
        // Get user session
        const requestBody = await event.request.json();
        console.log(requestBody, "reqqqbooodyyyy------------------------------------+++vivi");

        // Extract project entries from the request body
        const projectEntries = requestBody.projectEntries || [];

        // Insert each project entry
        const projectResults = await Promise.all(projectEntries.map(async (entry) => {
            const { projectTitle, projectDescription, startDate, endDate } = entry;

            // Insert project
            const projectResult = await Project.insert({
                title: projectTitle || ' ',
                description: projectDescription || ' ',
                start_date: startDate || ' ',
                end_date: endDate || ' ',
                resume: e.select(e.Resume, {
                    filter_single: { id: requestBody.resumeId }
                })
            });

            return projectResult;
        }));

        return json({ msg: "Projects added", projectResults });
    } catch (error) {
        console.error("Error adding project:", error);
        return json({ error: "Failed to add projects" });
    }
}

