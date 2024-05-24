import { baseURL } from '.';
import { GPTCreationType } from '../types/aiTypes';

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
