'use client';

import {
	ChatForm,
	Loader,
	RobotChatBubble,
	UserChatBubble,
} from '@/src/components';
import { useQuery } from '@tanstack/react-query';
import { LucideBot } from 'lucide-react';
import { KeyboardEvent, MouseEvent, useEffect, useRef, useState } from 'react';
import { openAI } from '../../helpers';

export const ChatContainer = () => {
	const [chatHistory, setChatHistory] = useState<string[]>([]);
	const promptRef = useRef<HTMLTextAreaElement>(null);
	const { isLoading, refetch } = useQuery({
		queryKey: ['chat', promptRef.current?.value],
		queryFn: () => fetchAI(promptRef.current!.value),
		retry: false,
		enabled: !!promptRef.current?.value,
	});

	useEffect(() => {
		document
			.querySelector('main > div')
			?.scrollTo({ top: 99999999, left: 0, behavior: 'smooth' });
	}, [chatHistory]);

	function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
		const lineCount = event.currentTarget.value.split(/\r?\n/).length;
		event.currentTarget.rows = Math.min(8, Math.max(1, lineCount));

		if (event.key === 'Enter' && event.shiftKey) {
			event.preventDefault();
			promptRef.current!.value = `${promptRef.current!.value + '\n'}`;
		} else if (event.key === 'Enter') {
			event.preventDefault();
			handleSubmit(event);
			return;
		}
	}

	function handleSubmit(
		event: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLTextAreaElement>
	) {
		event.preventDefault();
		if (!promptRef.current?.value || !/^\S/.test(promptRef.current?.value))
			return;

		console.log(promptRef.current.value);
		refetch();
		promptRef.current.value = '';
	}

	async function fetchAI(prompt: string) {
		setChatHistory((chatHistory) => {
			return [...chatHistory, promptRef.current!.value];
		});

		const response = await openAI({
			message: [...chatHistory, prompt],
			role: chatHistory.length % 2 === 0 ? 'assistant' : 'user',
		});

		if (response) {
			setChatHistory((chatHistory) => {
				return [...chatHistory, response];
			});
			console.log(response);
		} else {
			console.error('AI response was null');
		}

		return response;
	}

	return (
		<div className='flex flex-col items-center w-full h-screen overflow-y-auto'>
			<p className='text-muted-foreground text-sm justify-center items-center z-10 bg-white py-5 flex sticky top-0 w-[66%]'>
				MinitronAI
			</p>

			<div className='flex-1 flex flex-col gap-10 pb-20 w-[65%] px-8'>
				{chatHistory.map((message, index) => (
					<>
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

						{chatHistory.slice(-1)[0] === message && isLoading && (
							<div
								key={index + 1}
								className='ml-6 mt-2'
							>
								<section className='text-black font-bold flex gap-2 mb-1 text-sm -ml-7'>
									<LucideBot className='size-[1.15rem] -mt-[2px] text-primary' />
									<h4>MinitronAI</h4>
								</section>
								<Loader />
							</div>
						)}
					</>
				))}
			</div>

			<ChatForm
				prompt={promptRef.current?.value}
				onKeyDown={handleKeyDown}
				onClick={() => handleSubmit}
				ref={promptRef}
			/>
		</div>
	);
};

ChatContainer.displayName = 'ChatContainer';
