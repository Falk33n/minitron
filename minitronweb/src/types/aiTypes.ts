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
	requests: { $values: string[] };
	responses: { $values: [{ response: string }] };
};

export type ConvoStarterProps = {
	conversationId: number;
};

export type AllConvosProps = {
	$values: [{ conversationId: number; requests: { $values: string[] } }];
};

export type GPTCreationType = {
	id: string;
	name: string;
	description: string;
	systemPrompt: string;
	tone: string;
	style: string;
	starters: string[];
};

export type Agent = {
	name: string;
	systemPrompt: string;
};

export type AgentResponse = {
	$values: [
		{
			name: string;
			systemPrompt: string;
		}
	];
};
