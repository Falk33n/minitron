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
		role: 'user' | 'assistant';
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
