'use client';

import { gptBuilderAI, postStartConvo } from '@/src/helpers';
import { ClearConvoCtx } from '@/src/providers/clearConvo';
import { useMutation } from '@tanstack/react-query';
import { KeyboardEvent, useContext, useEffect, useRef, useState } from 'react';
import { ChatForm } from '../chat/chatForm';
import { ChatRender } from '../chat/chatRender';
import { toast } from '../ui/use-toast';

export function GptReviewer() {
	const [disabled, setDisabled] = useState(true);
	const { testAiChatHistory, setTestAiChatHistory } = useContext(ClearConvoCtx);
	const promptRef = useRef<HTMLTextAreaElement>(null);

	async function handleNewChat() {
		let newId = await postStartConvo();
		newId = parseInt(JSON.stringify(newId).replace(/[^\d]/g, ''), 10);
		return newId;
	}

	const { isPending, mutate } = useMutation({
		mutationKey: ['chat'],
		mutationFn: async () => {
			let newId = await handleNewChat();
			promptRef.current!.value = '';
			setDisabled((prev) => !prev);

			const response = await gptBuilderAI({
				conversation: testAiChatHistory.map((message, i) => ({
					content: message,
					role: `${i % 2 === 0 ? 'user' : 'assistant'}`,
				})),
				conversationId: newId,
			});

			if (response) {
				setTestAiChatHistory((testAiChatHistory) => {
					return [...testAiChatHistory, response];
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
			setTestAiChatHistory((testAiChatHistory) => {
				return [...testAiChatHistory, promptRef.current!.value];
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
			.querySelector('main > div > div')
			?.scrollTo({ top: 99999999, left: 0, behavior: 'smooth' });
	}, [testAiChatHistory]);

	return (
		<div className='bg-muted-foreground/5 w-full flex flex-col items-center h-screen overflow-y-auto'>
			<section className='pt-9 w-full text-center sticky top-0 z-[10] bg-[#F7F8F9]'>
				<h3 className='font-medium text-lg'>Playground</h3>
			</section>
			<ChatRender
				isPending={isPending}
				chatHistory={testAiChatHistory}
				testAi={true}
			/>

			<ChatForm
				disabled={disabled}
				onKeyDown={handleKeyDown}
				onChange={handleChange}
				testAi={true}
				ref={promptRef}
			/>
		</div>
	);
}
