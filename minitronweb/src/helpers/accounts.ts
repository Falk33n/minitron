import { baseURL } from './index';

export async function postRegister(data = {}) {
	const response = await fetch(`${baseURL}/User/register`, {
		method: 'POST',
		body: JSON.stringify(data),
		headers: {
			'Credentials': 'include',
			'Content-Type': 'application/json',
		},
	});

	if (!response.ok) throw new Error('Failed to register');
	return response.json();
}

export async function postLogIn(data = {}) {
	const response = await fetch(`${baseURL}/Auth/login`, {
		method: 'POST',
		body: JSON.stringify(data),
		headers: {
			'Credentials': 'include',
			'Content-Type': 'application/json',
		},
	});

	if (!response.ok) throw new Error('Failed to log in');
	return response.json();
}

export async function postLogout() {
	const response = await fetch(`${baseURL}/Auth/logout`, {
		method: 'POST',
	});

	if (!response.ok) {
		throw new Error('Something went wrong');
	}
	return response.json();
}

export async function getSession() {
	const response = await fetch(`${baseURL}/Auth/session`, {
		method: 'GET',
	});

	if (!response.ok) throw new Error('Unauthorized');
	return response.json();
}
