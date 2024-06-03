'use client';

import { gptBuilderAI, postStartConvo } from '@/src/helpers';
import { ClearConvoCtx } from '@/src/providers/clearConvo';
import { useMutation, useQuery } from '@tanstack/react-query';
import { LucideBot } from 'lucide-react';
import { KeyboardEvent, useContext, useEffect, useRef, useState } from 'react';
import { useConvo } from '../../hooks/useConvo';
import { GetGptDataCtx } from '../../providers/getGptData';
import { ChatForm } from '../chat/chatForm';
import { ChatRender } from '../chat/chatRender';
import { Loader } from '../misc/loader';
import { toast } from '../ui/use-toast';
import { StarterPrompts } from './starterPrompts';

export function GptReviewer() {
	const [disabled, setDisabled] = useState(true);
	const { systemPrompt, starters, starterPrompt } = useContext(GetGptDataCtx);
	const { testAiChatHistory, setTestAiChatHistory } = useContext(ClearConvoCtx);
	const [convoId, updateConvoId] = useConvo();
	const promptRef = useRef<HTMLTextAreaElement>(null);
	const [id, setId] = useState(-1);

	async function handleNewChat() {
		if (id !== -1) return;

		let newId = await postStartConvo();
		console.log(newId);

		if (newId?.conversationId) {
			updateConvoId('chat', newId.conversationId);
			setId(newId.conversationId);
			console.log(newId);
			return newId.conversationId;
		}
	}

	const { isLoading } = useQuery({
		queryKey: ['tryGptChat', systemPrompt],
		queryFn: async () => {
			let newId = await handleNewChat();

			const response = await gptBuilderAI({
				conversation: [
					{
						content: `You are a AI that ${systemPrompt} Also, start the conversation by greeting the user!`,
						role: 'system',
					},
				],
				conversationId: id !== -1 ? id : (await handleNewChat())!,
			});

			if (response) {
				setTestAiChatHistory((chatHistory) => {
					return [
						...chatHistory,
						`You are a AI that ${systemPrompt} Also, start the conversation by greeting the user!`,
						response.replaceAll('<br>', '\n'),
					];
				});
			} else {
				toast({
					variant: 'destructive',
					title: 'Error!',
					description: 'Something went wrong. Please try again.',
				});
				console.error('AI response was null');
			}
			return newId;
		},
		retry: false,
		enabled: !!systemPrompt,
	});

	const { isLoading: loader, refetch } = useQuery({
		queryKey: ['starterPromptGpt'],
		queryFn: async () => {
			promptRef.current!.value = '';
			setDisabled((prev) => !prev);

			type Props = {
				content: string;
				role: 'system' | 'user' | 'assistant';
			};

			const conversationHistory: Props[] = testAiChatHistory.map(
				(message, i) => ({
					content: message,
					role: `${i === 0 ? 'system' : i % 2 === 0 ? 'user' : 'assistant'}`,
				})
			);

			conversationHistory.push({
				content: starterPrompt,
				role: 'user',
			});

			const response = await gptBuilderAI({
				conversation: conversationHistory,
				conversationId: id,
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
		},
		retry: false,
		enabled: false,
	});

	const { isPending, mutate } = useMutation({
		mutationKey: ['chat'],
		mutationFn: async () => {
			promptRef.current!.value = '';
			setDisabled((prev) => !prev);

			const response = await gptBuilderAI({
				conversation: testAiChatHistory.map((message, i) => ({
					content: message,
					role: `${i === 0 ? 'system' : i % 2 === 0 ? 'user' : 'assistant'}`,
				})),
				conversationId: id,
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

	useEffect(() => {
		if (!systemPrompt || id === -1) return;
		setTestAiChatHistory([]);
		//eslint-disable-next-line
	}, [systemPrompt]);

	useEffect(() => {
		if (!starterPrompt) return;
		setTestAiChatHistory((chatHistory) => {
			return [...chatHistory, starterPrompt];
		});
		refetch();
		//eslint-disable-next-line
	}, [starterPrompt]);

	return (
		<div className='bg-muted-foreground/5 w-full flex flex-col items-center h-screen overflow-y-auto'>
			<section className='pt-9 w-full text-center sticky top-0 z-[10] bg-[#F7F8F9]'>
				<h3 className='font-medium text-lg'>Playground</h3>
			</section>
			<ChatRender
				isPending={isPending}
				chatHistory={testAiChatHistory}
				testAi={true}
			>
				{(isLoading || loader) && (
					<div className='ml-6 mt-2'>
						<section className='text-black font-bold flex gap-2 mb-1 text-sm -ml-7'>
							<LucideBot className='size-[1.15rem] -mt-[2px] text-primary' />
							<h4>MinitronAI</h4>
						</section>
						<Loader />
					</div>
				)}
			</ChatRender>

			{starters.length === 4 && <StarterPrompts />}

			<ChatForm
				disabled={disabled ? disabled : !systemPrompt ? true : false}
				onKeyDown={handleKeyDown}
				onChange={handleChange}
				testAi={true}
				ref={promptRef}
			/>
		</div>
	);
}
