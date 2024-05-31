import { baseURL } from '.';
import { Agent, GPTCreationType } from '../types/aiTypes';

export async function createNewGpt(data: GPTCreationType) {
	const url = new URL(
		`${baseURL}/Agent/CreateAgent?id=${data.id}&name=${data.name}&description=${data.description}&systemPrompt=${data.systemPrompt}&tone=${data.tone}&style=${data.style}`
	);
	const res = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
	});

	if (!res.ok) throw new Error('Something went wrong');
	return res;
}

export async function getAgentsByUserId(userId: string): Promise<Agent[]> {
	if (!userId || userId === '')
		throw new Error("Couldn't retrieve conversation");

	const response = await fetch(`${baseURL}/Agent/GetAgentsbyUserId/${userId}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	});

	if (!response.ok) throw new Error('Network response was not ok');

	const data = await response.json();

	// Validate that the data has the expected structure
	if (!data.$values || !Array.isArray(data.$values)) {
		throw new Error('Invalid response format');
	}

	return data.$values;
}
