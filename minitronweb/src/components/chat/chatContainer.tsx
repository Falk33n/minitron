'use client';

import {
	ChatForm,
	ChatRender,
	Loader,
	NotAllowed,
	RobotChatBubble,
	UserChatBubble,
	toast,
} from '@/src/components';
import { useMutation, useQuery } from '@tanstack/react-query';
import { LucideBot } from 'lucide-react';
import {
	Fragment,
	KeyboardEvent,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react';
import { minitronAI } from '../../helpers';
import { getConvos, postStartConvo } from '@/src/helpers/convos';
import { useConvo } from '@/src/hooks/useConvo';
import { ClearConvoCtx } from '@/src/providers/clearConvo';

export const ChatContainer = () => {
	const [disabled, setDisabled] = useState(true);
	const [convoId, updateConvoId] = useConvo();
	const { forceClear, setForceClear, newChat, chatHistory, setChatHistory } =
		useContext(ClearConvoCtx);
	const promptRef = useRef<HTMLTextAreaElement>(null);

	const { error, isLoading, refetch } = useQuery({
		queryKey: ['getConvoId'],
		queryFn: async () => {
			if (convoId) {
				const response = await getConvos(convoId);
				const convoArray: string[] = [];

				response.responses.forEach((res, i) => {
					if (response.requests[i]) convoArray.push(response.requests[i]);
					convoArray.push(res.response);
				});
				setChatHistory(convoArray);
			}
			return true;
		},
		retry: false,
	});

	async function handleNewChat() {
		if (convoId) return;
		let newId = await postStartConvo();
		newId = parseInt(JSON.stringify(newId).replace(/[^\d]/g, ''), 10);
		updateConvoId('chat', newId);
		return newId;
	}

	const { isPending, mutate } = useMutation({
		mutationKey: ['chat'],
		mutationFn: async () => {
			let newId = await handleNewChat();
			promptRef.current!.value = '';
			setDisabled((prev) => !prev);

			const response = await minitronAI({
				conversation: chatHistory.map((message, i) => ({
					content: message,
					role: `${i % 2 === 0 ? 'user' : 'assistant'}`,
				})),
				conversationId: newId ? newId : parseInt(convoId!, 10),
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

	function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
		if (
			event.key !== 'Enter' ||
			(event.key !== 'Enter' && !event.shiftKey) ||
			!promptRef.current
		)
			return;
		event.preventDefault();

		if (event.key === 'Enter' && event.shiftKey) {
			promptRef.current.value += '\n';
			handleChange();
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

	useEffect(() => {
		document
			.querySelector('main > div')
			?.scrollTo({ top: 99999999, left: 0, behavior: 'smooth' });
	}, [chatHistory]);

	useEffect(() => {
		if (!newChat) refetch();
		if (!forceClear) return;
		setChatHistory([]);
		setForceClear(false); //eslint-disable-next-line
	}, [forceClear, convoId]);

	return (
		<>
			{error && !isLoading ? (
				<NotAllowed />
			) : (
				<div className='flex flex-col items-center w-full h-screen overflow-y-auto'>
					<p className='text-muted-foreground text-sm justify-center items-center z-10 bg-white py-5 flex sticky top-0 w-[80%]'>
						MinitronAI
					</p>

					<ChatRender
						isPending={isPending}
						chatHistory={chatHistory}
					/>

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
			)}
		</>
	);
};

ChatContainer.displayName = 'ChatContainer';
