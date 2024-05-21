import { SingleUserType } from '../types/adminTypes';
import { baseURL } from './index';

export async function getUsers() {
	const response = await fetch(`${baseURL}/User/getall`, {
		method: 'GET',
	});

	if (!response.ok) throw new Error("Couldn't retrieve users");
	return response.json();
}

export async function getLogs() {
	const response = await fetch(`${baseURL}/Logs/getlogs`, {
		method: 'GET',
	});

	if (!response.ok) throw new Error("Couldn't retrieve logs");
	return response.json();
}

export async function getSingleUser(id: string) {
	if (!id || id === '') throw new Error("Couldn't retrieve id");

	const url = new URL(`${baseURL}/User/getbyid/${id}`);
	const response = await fetch(url, {
		method: 'GET',
	});

	if (!response.ok) throw new Error("Couldn't retrieve the user");
	return response.json() as Promise<SingleUserType>;
}
