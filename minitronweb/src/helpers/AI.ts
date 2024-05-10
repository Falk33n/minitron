import OpenAI from 'openai';

type aiProps = {
	message: string[];
	role: 'system' | 'assistant' | 'user';
};

const openai = new OpenAI({
	apiKey: process.env.NEXT_PUBLIC_API_KEY,
	dangerouslyAllowBrowser: true,
});

export async function openAI({ role, message }: aiProps) {
	const completion = await openai.chat.completions.create({
		messages: [{ role: `${role}`, content: `${message.join('\n')}` }],
		model: 'gpt-4-turbo',
	});

	return completion.choices[0].message?.content;
}
