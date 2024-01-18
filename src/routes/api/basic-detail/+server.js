import { e, BasicDetails, Address } from '$lib/server/models/database';
import { json } from '@sveltejs/kit';

export async function POST(event) {
	// Get user session
	const requestBody = await event.request.json();
	console.log(requestBody, 'reqqqbooodyyyy------------------------------------');

	// Insert BasicDetails
	const basicInformationResult = await BasicDetails.insert({
		full_name: requestBody.full_name || ' ',
		email: requestBody.email || ' ',
		phone: requestBody.phone_number || ' ',
		designation: requestBody.desigination || ' ',
		summary: requestBody.summary || ' ',
		avatar_src: requestBody.imageUrl || ' ',
		resume: e.select(e.Resume, {
			filter_single: { id: requestBody.resumeId }
		})
	});

	// Insert address
	const addressResult = await Address.insert({
		address: requestBody.address || ' ',
		city: requestBody.city || ' ',
		state: requestBody.state || ' ',
		country: requestBody.country || ' ',
		postal_code: requestBody.pinCode || ' ',
		current_location: requestBody.currentLocation || ' ',
		resume: e.select(e.Resume, {
			filter_single: { id: requestBody.resumeId }
		})
	});

	return json({ basicInformationResult, addressResult });
}
