'use client';

import { ChatForm, RobotChatBubble, UserChatBubble } from '@/src/components';
import { KeyboardEvent, SyntheticEvent, useState } from 'react';
import { openAI } from '../../helpers';

export const ChatContainer = () => {
	const [chatHistory, setChatHistory] = useState<string[]>([]);
	const [prompt, setPrompt] = useState('');

	async function handleSubmit(event: SyntheticEvent) {
		const textArea = event.target as HTMLTextAreaElement;
		const lineCount = textArea.value.split(/\r?\n/).length;
		const keyboardEvent = event as KeyboardEvent;
		const currentPrompt = prompt;
		textArea.rows = Math.min(8, Math.max(1, lineCount));

		if (keyboardEvent.key === 'Enter') {
			event.preventDefault();
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
	}

	return (
		<div className='flex flex-col mx-auto w-full h-screen px-72 overflow-y-auto'>
			<p className='text-muted-foreground text-sm justify-center items-center py-5 flex'>
				MinitronAI
			</p>

			<div className='flex-1 flex flex-col gap-14 pb-20'>
				{chatHistory.map((message, index) => (
					<section
						key={index}
						className={`py-4 px-6 rounded-2xl w-[90%] relative ${
							index % 2 === 0
								? 'bg-primary text-white ml-auto'
								: 'bg-gray-300/55 text-foreground mr-auto'
						}`}
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
				onSubmit={(event) => {
					event.preventDefault();
					handleSubmit(event);
				}}
				prompt={prompt}
				onChange={(event) =>
					setPrompt((event.target as HTMLInputElement).value)
				}
			/>
		</div>
	);
};

ChatContainer.displayName = 'ChatContainer';
