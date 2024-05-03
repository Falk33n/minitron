'use client';

import { ChatForm, RobotChatBubble, UserChatBubble } from '@/src/components';
import { useState } from 'react';
import { openAI } from '../helpers';

export const ChatContainer = () => {
	const [chatHistory, setChatHistory] = useState<string[]>([]);
	const [prompt, setPrompt] = useState('');

	async function handleSubmit() {
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
		<div className='flex flex-col mx-auto w-full h-screen px-72 overflow-y-auto'>
			<p className='text-muted-foreground text-sm justify-center items-center py-5 flex'>
				Minitron Code Assistant
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
					handleSubmit();
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
