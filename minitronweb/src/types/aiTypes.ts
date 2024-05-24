import { HTMLAttributes } from 'react';

export type ChatBubbleProps = HTMLAttributes<HTMLElement> & {
	message: string | Response;
	testAi?: boolean;
};

export type OpenAiProps = {
	message: string[];
	role: 'system' | 'assistant' | 'user';
};

export type MinitronAiProps = {
	conversation: {
		content: string;
		role: 'user' | 'assistant' | 'system';
	}[];
	conversationId: number;
};

export type ConvoProps = {
	requests: string[];
	responses: [{ response: string }];
};

export type AllConvosProps = [
	{
		conversationId: number;
		requests: string[];
	}
];

export type GPTCreationType = {
	id: string;
	name: string;
	description: string;
	systemPrompt: string;
	tone: string;
	style: string;
};
