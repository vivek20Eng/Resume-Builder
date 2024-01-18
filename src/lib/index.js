// place files you want to import through the `$lib` alias in this folder.
// src/routes/api/insertData.ts

import { query } from '$lib/edgedb';
 // Assuming you have an EdgeDB client utility

export async function post(request) {
  try {
    // Execute the EdgeDB insert query here
    const result = await query(/* Your EdgeDB insert query here */);
    return {
      status: 200,
      body: { success: true, result },
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      body: { success: false, error: 'Internal Server Error' },
    };
  }
}
