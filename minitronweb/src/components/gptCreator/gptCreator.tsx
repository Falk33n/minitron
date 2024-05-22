'use client';

import { useMutation } from '@tanstack/react-query';
import { KeyboardEvent, useContext, useEffect, useRef, useState } from 'react';
import { Button } from '../forms/button';
import { ChatForm } from '../chat/chatForm';
import { ClearConvoCtx } from '@/src/providers/clearConvo';
import { useConvo } from '@/src/hooks/useConvo';
import { minitronAI, postStartConvo } from '@/src/helpers';
import { toast } from '../ui/use-toast';
import { ChatRender } from '../chat/chatRender';
import { GptConfigure } from './gptConfigure';

export function GptCreator() {
	const [disabled, setDisabled] = useState(true);
	const [convoId, updateConvoId] = useConvo();
	const [configVisible, setConfigVisible] = useState(false);
	const { chatHistory, setChatHistory } = useContext(ClearConvoCtx);
	const promptRef = useRef<HTMLTextAreaElement>(null);

	async function handleNewChat() {
		if (convoId) return;
		let newId = await postStartConvo();
		newId = parseInt(JSON.stringify(newId).replace(/[^\d]/g, ''), 10);
		updateConvoId('createprofile', newId);
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
		if (configVisible) return;
		document
			.querySelector('main > div > div')
			?.scrollTo({ top: 99999999, left: 0, behavior: 'smooth' });
	}, [chatHistory]);

	return (
		<div className='bg-white w-full flex flex-col items-center h-screen overflow-y-auto'>
			<div className='w-full flex justify-center sticky top-0 z-[10] bg-white'>
				<div className='w-[45%] bg-black/5 flex gap-3 justify-center py-3 rounded-xl mt-4'>
					<Button
						className={`flex-1 ml-3 ${
							configVisible
								? 'bg-black/5 text-black hover:bg-black/15 focus-visible:bg-black/15'
								: 'text-white'
						}`}
						onClick={() => setConfigVisible(false)}
					>
						Create
					</Button>
					<Button
						className={`flex-1 mr-3 ${
							configVisible
								? 'text-white'
								: 'bg-black/5 text-black hover:bg-black/15 focus-visible:bg-black/15'
						}`}
						onClick={() => setConfigVisible(true)}
					>
						Configure
					</Button>
				</div>
			</div>

			<ChatRender
				configVisible={configVisible}
				isPending={isPending}
				chatHistory={chatHistory}
			/>

			<ChatForm
				className={configVisible ? 'absolute top-[200rem] sr-only' : ''}
				disabled={false}
				onKeyDown={handleKeyDown}
				onChange={handleChange}
				ref={promptRef}
			/>

			<GptConfigure configVisible={configVisible} />
		</div>
	);
}
