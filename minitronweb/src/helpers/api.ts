export async function postAccounts(url = '', data = {}, rememberMe?: boolean) {
	const response = await fetch(url, {
		method: 'POST',
		body: JSON.stringify(data),
		headers: {
			'Credentials': 'include',
			'Content-Type': 'application/json',
		},
	});

	return response.json();
}
