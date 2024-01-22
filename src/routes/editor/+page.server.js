// commented for testing -----


// import { e,BasicDetails} from '$lib/server/models/database.js';
// /** @type {import('./$types').PageServerLoad} */
// /** @type {import('./$types').Actions} */

// export async function load(event) {
//     // const session = await event.locals.getSession();
// // const loggedInUser = session?.user;
// try {
//     const permissionResult = await BasicDetails.select((BasicDetails) => ({
//         id: true,
//         email:true,
      
        
//     }));
    

//   console.log(permissionResult,"permissionResult------------")
//     // console.log("roles",UserRoles,permissionResult,PermissionCategory)
// // console.log(permissionResult,PermissionCategory,UserRole,"****+------------")
//     return {permissionResult}
// } catch (error) {
//     console.error('Error update user permission:', error);
//     return new Response('Internal Server Error', { status: 500 });
// }
// }