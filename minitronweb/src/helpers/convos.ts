import { baseURL } from '.';
import { ConvoProps } from '../types/aiTypes';

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

export async function getConvos(id: string) {
	if (!id || id === '') throw new Error("Couldn't retrieve conversation");

	const url = new URL(`${baseURL}/Chat/GetConversationDetails`);
	url.searchParams.append('conversationId', id);

	const response = await fetch(url, {
		method: 'GET',
	});

	if (!response.ok) {
		throw new Error("Couldn't retrieve conversation");
	}

	return response.json() as Promise<ConvoProps>;
}
