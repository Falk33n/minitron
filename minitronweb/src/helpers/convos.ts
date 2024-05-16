import { baseURL } from '.';

export async function postStartConvo(): Promise<number> {
	const response = await fetch(`${baseURL}/Chat/StartConversation`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
	});

	if (!response.ok) {
		throw new Error('Failed to fetch data');
	}

	return response.json();
}

export async function getConvos() {
	const response = await fetch(`${baseURL}/Chat/GetConversationDetails`, {
		method: 'GET',
	});

	if (!response.ok) {
		throw new Error("Couldn't retrieve logs");
	}

	return response.json();
}
