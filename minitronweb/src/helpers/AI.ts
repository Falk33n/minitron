import OpenAI from 'openai';
import { baseURL } from '.';
import { MinitronAiProps, OpenAiProps } from '../types/aiTypes';

const openai = new OpenAI({
	apiKey: process.env.NEXT_PUBLIC_API_KEY,
	dangerouslyAllowBrowser: true,
});

export async function openAI({ role, message }: OpenAiProps) {
	const completion = await openai.chat.completions.create({
		messages: [{ role: `${role}`, content: `${message.join('\n')}` }],
		model: 'gpt-4-turbo',
	});

	if (!completion) throw new Error('Something went wrong');
	return completion.choices[0].message?.content;
}

export async function minitronAI(data: MinitronAiProps) {
	const res = await fetch(`${baseURL}/Chat/Sendmessage`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	});

	if (!res.ok) throw new Error('Something went wrong');
	return ((await res.json()) as { response: string }).response;
}
