'use client';

import { ChatForm, ChatRender, NotAllowed, toast } from '@/src/components';
import { getConvos, postStartConvo } from '@/src/helpers/convos';
import { useConvo } from '@/src/hooks/useConvo';
import { ClearConvoCtx } from '@/src/providers/clearConvo';
import { DropdownMenuSeparator } from '@radix-ui/react-dropdown-menu';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ChevronDown } from 'lucide-react';
import { KeyboardEvent, useContext, useEffect, useRef, useState } from 'react';
import { getAgentsByUserId, getCurrentUser, minitronAI } from '../../helpers';
import { Agent } from '../../types/aiTypes';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export const ChatContainer = () => {
	const [disabled, setDisabled] = useState(true);
	const [gpt, setGpt] = useState<Agent[]>([]);
	const [gptName, setGptName] = useState('');
	const [gptPrompt, setGptPrompt] = useState('');
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

			if (chatHistory.length === 0) {
				const response = await minitronAI({
					conversation: [
						{
							content: gptPrompt ? gptPrompt : 'You are a helpfull assistant',
							role: 'system',
						},
					],
					conversationId: newId ? newId : parseInt(convoId!, 10),
				});

				if (response) {
					setChatHistory((chatHistory) => {
						return [
							...chatHistory,
							gptPrompt ? gptPrompt : 'You are a helpfull assistant',
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
				return response;
			} else {
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
			}
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

	async function getUserGpts() {
		const res = await getCurrentUser();

		if (res) {
			try {
				const agents = await getAgentsByUserId(res.id);
				setGpt(agents);
			} catch (error) {
				toast({
					variant: 'destructive',
					title: 'Error!',
					description: 'Something went wrong. Please try again.',
				});
				console.error('Could not retrieve Agents');
				console.error('Failed to fetch agents:', error);
			}
		} else {
			toast({
				variant: 'destructive',
				title: 'Error!',
				description: 'Something went wrong. Please try again.',
			});
			console.error('User was null');
		}
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

	useEffect(() => {
		if (convoId) setChatHistory([]); //eslint-disable-next-line
	}, []);

	useEffect(() => {
		getUserGpts();
	}, []);

	return (
		<>
			{error && !isLoading ? (
				<NotAllowed />
			) : (
				<div className='flex flex-col items-center w-full h-screen overflow-y-auto'>
					<DropdownMenu>
						<DropdownMenuTrigger className='mt-2 rounded-lg flex justify-between gap-1 items-center text-muted-foreground p-2 hover:text-black hover:bg-navbarList/80'>
							{gptName ? gptName : 'Select your GPT'}
							<ChevronDown
								className='text-primary size-5'
								aria-hidden
							/>
						</DropdownMenuTrigger>
						<DropdownMenuContent className='w-[12rem]'>
							<DropdownMenuLabel>Select your GPT</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<>
								{gpt.map((agent, i) => (
									<DropdownMenuItem
										key={i}
										onClick={() => {
											setGptName(agent.name);
											setGptPrompt(agent.systemPrompt);
										}}
										className='cursor-pointer hover:bg-navbarList/50 focus-visible:bg-navbarList/50 hover:font-medium focus-visible:font-medium'
									>
										{agent.name}
									</DropdownMenuItem>
								))}
							</>
						</DropdownMenuContent>
					</DropdownMenu>

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
