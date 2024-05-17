'use client';

import {
	ChatForm,
	Loader,
	RobotChatBubble,
	UserChatBubble,
	toast,
} from '@/src/components';
import { useMutation, useQuery } from '@tanstack/react-query';
import { LucideBot } from 'lucide-react';
import {
	ChangeEvent,
	Fragment,
	KeyboardEvent,
	MouseEvent,
	use,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import { minitronAI, openAI } from '../../helpers';
import { getConvos, postStartConvo } from '@/src/helpers/convos';
import { useConvo } from '@/src/hooks/useConvo';

export const ChatContainer = () => {
	const [chatHistory, setChatHistory] = useState<string[]>([]);
	const [disabled, setDisabled] = useState(true);
	const [convoId, updateConvoId] = useConvo();
	const [id, setId] = useState<number>(-1);
	const promptRef = useRef<HTMLTextAreaElement>(null);

	const { isLoading } = useQuery({
		queryKey: ['getConvoId'],
		queryFn: async () => {
			if (!convoId || convoId === '') return false;
			if (convoId) {
				const response = await getConvos(convoId);
				const convoArray: string[] = [];

				response.responses.forEach((res, i) => {
					if (response.requests[i]) convoArray.push(response.requests[i]);
					convoArray.push(res.response);
				});

				setChatHistory(convoArray);
			}
		},
		retry: false,
	});

	const { isPending, mutate } = useMutation({
		mutationKey: ['chat'],
		mutationFn: async () => {
			let newId = id;

			if (chatHistory.length === 1 && id === -1) {
				newId = await postStartConvo();
				newId = parseInt(JSON.stringify(newId).replace(/[^\d]/g, ''), 10);
				setId(newId);
				updateConvoId(newId);
			}

			promptRef.current!.value = '';
			setDisabled((prev) => !prev);

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
				toast({
					variant: 'destructive',
					title: 'Error!',
					description: 'Something went wrong. Please try again.',
				});

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
		if (
			event.key !== 'Enter' ||
			(event.key !== 'Enter' && !event.shiftKey) ||
			!promptRef.current
		)
			return;
		event.preventDefault();

		if (event.key === 'Enter' && event.shiftKey) {
			promptRef.current.value = `${promptRef.current.value + '\n'}`;
		} else if (event.key === 'Enter' && !disabled) {
			setChatHistory((chatHistory) => {
				return [...chatHistory, promptRef.current!.value];
			});
			return mutate();
		}
	}

	function handleChange() {
		if (!promptRef.current) return;

		promptRef.current.style.height = '0px';
		const textarea = promptRef.current;
		const hasContent = textarea.value.trim().length > 0;
		const lineHeight = parseInt(getComputedStyle(textarea).lineHeight, 10);
		const padding = parseInt(getComputedStyle(textarea).paddingTop, 10) * 2;
		const maxHeight = lineHeight * 10 + padding;
		const scrollHeight = textarea.scrollHeight;

		if (disabled === hasContent) setDisabled((prev) => !prev);
		if (scrollHeight > maxHeight) {
			textarea.style.paddingRight = '2.75rem';
		} else textarea.style.paddingRight = '4rem';
		textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
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
				disabled={disabled}
				onKeyDown={handleKeyDown}
				onChange={handleChange}
				onClick={async (e) => {
					e.preventDefault();
					mutate();
				}}
				ref={promptRef}
			/>
		</div>
	);
};

ChatContainer.displayName = 'ChatContainer';
