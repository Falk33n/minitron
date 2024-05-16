import { HTMLAttributes } from 'react';

export type ChatBubbleProps = HTMLAttributes<HTMLElement> & {
	message: string | Response;
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
