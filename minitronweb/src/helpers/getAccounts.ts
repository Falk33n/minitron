import { baseURL } from '../helpers/index';

export async function getUsers() {
	try {
		const response = await fetch(`${baseURL}/User/getall`, {
			method: 'GET',
			credentials: 'include',
		});

		if (!response.ok) {
			throw new Error("Couldn't retrieve users");
		}

		return response.json();
	} catch (error) {
		throw error;
	}
}
