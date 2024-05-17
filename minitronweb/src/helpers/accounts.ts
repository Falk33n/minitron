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

	if (!response.ok) {
		throw new Error('Failed to fetch data');
	}

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

	if (!response.ok) {
		throw new Error();
	}

	return response.json();
}

export async function getSession() {
	/* const response = await fetch(`${baseURL}/Auth/session`, {
		method: 'GET',
	});

	if (!response.ok) {
		throw new Error('Unauthorized');
	}

	return response.json(); */
	return true;
}
