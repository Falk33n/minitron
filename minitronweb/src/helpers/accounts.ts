const baseURL = `${
	process.env.NEXT_PUBLIC_HOST + ':' + process.env.NEXT_PUBLIC_PORT + '/api'
}`;

export async function postRegister(data = {}) {
	const response = await fetch(`${baseURL}/User/register`, {
		method: 'POST',
		body: JSON.stringify(data),
		headers: {
			'Credentials': 'include',
			'Content-Type': 'application/json',
		},
	});

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

	return response.json();
}

export async function getAuth(data = {}) {
	const response = await fetch(`${baseURL}/Auth/login`, {
		method: 'POST',
		body: JSON.stringify(data),
		headers: {
			'Credentials': 'include',
			'Content-Type': 'application/json',
		},
	});

	return response.json();
}
