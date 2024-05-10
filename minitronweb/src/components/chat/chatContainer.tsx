'use client';

import { ChatForm, RobotChatBubble, UserChatBubble } from '@/src/components';
import { FormEvent, KeyboardEvent, useState } from 'react';
import { openAI } from '../../helpers';

export const ChatContainer = () => {
	const [chatHistory, setChatHistory] = useState<string[]>([]);
	const [prompt, setPrompt] = useState('');

	function handleKeyDown(
		event: KeyboardEvent<HTMLFormElement> | KeyboardEvent<HTMLTextAreaElement>
	) {
		const lineCount = event.currentTarget.value.split(/\r?\n/).length;
		event.currentTarget.rows = Math.min(8, Math.max(1, lineCount));

		if (event.key === 'Enter' && event.shiftKey) {
			event.preventDefault();
			setPrompt(event.currentTarget.value + '\n');
		} else if (event.key === 'Enter') {
			event.preventDefault();
			handleSubmit(event);
			event.currentTarget.rows = 1;
			return;
		}
	}

	async function handleSubmit(
		event: FormEvent<HTMLFormElement> | KeyboardEvent<HTMLTextAreaElement>
	) {
		event.preventDefault();

		if (!prompt || !/^\S/.test(prompt)) return;
		const currentPrompt = prompt;

		setPrompt('');
		setChatHistory((chatHistory) => {
			return [...chatHistory, currentPrompt];
		});

		const aiResponse = await openAI({
			message: [...chatHistory, currentPrompt],
			role: chatHistory.length % 2 === 0 ? 'assistant' : 'user',
		});

		if (aiResponse) {
			setChatHistory((chatHistory) => {
				return [...chatHistory, aiResponse];
			});
		} else {
			console.error('AI response was null');
		}
	}

	return (
		<div className='flex flex-col items-center w-full h-screen overflow-y-auto'>
			<p className='text-muted-foreground text-sm justify-center items-center z-10 bg-white py-5 flex sticky top-0 w-[65rem]'>
				MinitronAI
			</p>

			<div className='flex-1 flex flex-col gap-10 pb-20 w-[65%] px-8'>
				{chatHistory.map((message, index) => (
					<section
						key={index}
						className={`py-4 px-6 rounded-2xl w-[90%] text-foreground bg-white relative break-words`}
					>
						{index % 2 === 0 ? (
							<UserChatBubble message={message} />
						) : (
							<RobotChatBubble message={message} />
						)}
					</section>
				))}
			</div>

			<ChatForm
				prompt={prompt}
				onSubmit={handleSubmit}
				onKeyDown={handleKeyDown}
				onChange={(e) => {
					setPrompt((e.target as HTMLTextAreaElement).value);
				}}
			/>
		</div>
	);
};

ChatContainer.displayName = 'ChatContainer';
