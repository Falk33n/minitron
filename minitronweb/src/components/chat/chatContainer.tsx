'use client';

import {
	ChatForm,
	Loader,
	RobotChatBubble,
	UserChatBubble,
} from '@/src/components';
import { useMutation, useQuery } from '@tanstack/react-query';
import { LucideBot } from 'lucide-react';
import {
	Fragment,
	KeyboardEvent,
	MouseEvent,
	useEffect,
	useRef,
	useState,
} from 'react';
import { minitronAI, openAI } from '../../helpers';
import { postStartConvo } from '@/src/helpers/convos';

export const ChatContainer = () => {
	const [chatHistory, setChatHistory] = useState<string[]>([]);
	const [id, setId] = useState<number>(-1);
	const promptRef = useRef<HTMLTextAreaElement>(null);

	const { isPending, error, mutate } = useMutation({
		mutationKey: ['chat'],
		mutationFn: async () => {
			let newId = id;

			setChatHistory((chatHistory) => {
				return [...chatHistory, promptRef.current!.value];
			});

			promptRef.current!.value = '';

			if (chatHistory.length === 0 && id === -1) {
				newId = await postStartConvo();
				newId = parseInt(JSON.stringify(newId).replace(/[^\d]/g, ''), 10);
				setId(newId);
			}

			const response = await minitronAI({
				conversation: chatHistory.map((message, i) => ({
					content: message,
					role: `${i % 2 === 0 ? 'user' : 'assistant'}`,
				})),
				conversationId: newId,
			});

			if (response) {
				setChatHistory((chatHistory) => {
					return [...chatHistory, response];
				});
			} else {
				console.error('AI response was null');
			}

			return response;
		},
	});

	useEffect(() => {
		document
			.querySelector('main > div')
			?.scrollTo({ top: 99999999, left: 0, behavior: 'smooth' });
	}, [chatHistory]);

	function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
		if (event.key === 'Enter' && event.shiftKey) {
			event.preventDefault();
			promptRef.current!.value = `${promptRef.current!.value + '\n'}`;
		} else if (event.key === 'Enter') {
			event.preventDefault();
			mutate();
			return;
		}
	}

	return (
		<div className='flex flex-col items-center w-full h-screen overflow-y-auto'>
			<p className='text-muted-foreground text-sm justify-center items-center z-10 bg-white py-5 flex sticky top-0 w-[66%]'>
				MinitronAI
			</p>

			<div className='flex-1 flex flex-col gap-10 pb-20 w-[65%] px-8'>
				{chatHistory.map((message, index) => (
					<Fragment key={index}>
						<section
							className={`py-4 px-6 rounded-2xl w-[90%] text-foreground bg-white relative break-words`}
						>
							{index % 2 === 0 ? (
								<UserChatBubble message={message} />
							) : (
								<RobotChatBubble message={message} />
							)}
						</section>

						{chatHistory.slice(-1)[0] === message && isPending && (
							<div className='ml-6 mt-2'>
								<section className='text-black font-bold flex gap-2 mb-1 text-sm -ml-7'>
									<LucideBot className='size-[1.15rem] -mt-[2px] text-primary' />
									<h4>MinitronAI</h4>
								</section>
								<Loader />
							</div>
						)}
					</Fragment>
				))}
			</div>

			<ChatForm
				prompt={promptRef.current?.value}
				onKeyDown={handleKeyDown}
				onClick={() => mutate}
				ref={promptRef}
			/>
		</div>
	);
};

ChatContainer.displayName = 'ChatContainer';
