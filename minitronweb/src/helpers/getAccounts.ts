import { baseURL } from '../helpers/index';

export async function getUsers() {
	const response = await fetch(`${baseURL}/User/getall`, {
		method: 'GET',
	});

	if (!response.ok) {
		throw new Error("Couldn't retrieve users");
	}

	return response.json();
}
