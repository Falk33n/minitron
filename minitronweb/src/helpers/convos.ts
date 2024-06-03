import { baseURL } from '.';
import {
	AllConvosProps,
	ConvoProps,
	ConvoStarterProps,
} from '../types/aiTypes';

export async function postStartConvo(): Promise<ConvoStarterProps> {
	const response = await fetch(`${baseURL}/Chat/StartConversation`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
	});

	if (!response.ok) throw new Error('Failed to Start Conversation');
	return await response.json();
}

export async function getConvos(id: string) {
	if (!id || id === '') throw new Error("Couldn't retrieve conversation");

	const url = new URL(`${baseURL}/Chat/GetConversationDetails`);
	url.searchParams.append('conversationId', id);

	const response = await fetch(url, {
		method: 'GET',
	});

	if (!response.ok) throw new Error("Couldn't retrieve conversation");
	return response.json() as Promise<ConvoProps>;
}

export async function getAllConvos() {
	const response = await fetch(`${baseURL}/Chat/GetAllConversationsByUserId`, {
		method: 'GET',
	});

	if (!response.ok) throw new Error("Couldn't retrieve the conversations");
	return response.json() as Promise<AllConvosProps>;
}

export function summarizeConvo(convoArray: AllConvosProps) {
	const ids: number[] = [];
	const convos: string[] = [];
	const id = convoArray.$values.map((value) => ids.push(value.conversationId));
	const convo = convoArray.$values.map((value) =>
		value.requests.$values.map((request) => convos.push(request))
	);

	if (!id || !convo) throw new Error('Could not retrieve chat details');
	return { ids, convos };
}
