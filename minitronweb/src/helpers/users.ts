import { baseURL } from '.';
import { UserType } from '../types/adminTypes';

export async function getSingleUser(id: string) {
	if (!id || id === '') throw new Error("Couldn't retrieve id");

	const url = new URL(`${baseURL}/User/getbyid/${id}`);
	const response = await fetch(url, {
		method: 'GET',
	});

	if (!response.ok) throw new Error("Couldn't retrieve the user");
	return response.json() as Promise<UserType>;
}

export async function editUser(data: {}) {
	const response = await fetch(`${baseURL}/User/EditUser`, {
		method: 'PATCH',
		body: JSON.stringify(data),
		headers: {
			'Content-Type': 'application/json',
		},
	});

	if (!response.ok) throw new Error('Failed to update user');
	return response;
}

export async function deleteSingleUser(id: string) {
	if (!id || id === '') throw new Error("Couldn't retrieve id");

	const url = new URL(`${baseURL}/User/delete/${id}`);
	const response = await fetch(url, {
		method: 'DELETE',
	});

	if (!response.ok) throw new Error("Couldn't delete the user");
	return response;
}
