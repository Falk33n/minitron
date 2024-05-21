import { baseURL } from '.';
import { toast } from '../components';
import { AllConvosProps, ConvoProps } from '../types/aiTypes';

export async function postStartConvo(): Promise<number> {
	const response = await fetch(`${baseURL}/Chat/StartConversation`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
	});

	if (!response.ok) throw new Error('Failed to Start Conversation');

	return response.json();
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

	for (const convo of convoArray) {
		if (!convo.conversationId || !convo.requests) continue;
		ids.push(convo.conversationId);

		for (const request of convo.requests) {
			if (!request) continue;
			convos.push(request);
		}
	}

	if (convos.length > ids.length) convos.length = ids.length;

	return { ids, convos };
}
