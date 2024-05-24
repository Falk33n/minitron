'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import {
	KeyboardEvent,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import { Button } from '../forms/button';
import { ChatForm } from '../chat/chatForm';
import { ClearConvoCtx } from '@/src/providers/clearConvo';
import { gptBuilderAI, postStartConvo } from '@/src/helpers';
import { toast } from '../ui/use-toast';
import { ChatRender } from '../chat/chatRender';
import { GptConfigure } from './gptConfigure';
import { LucideBot } from 'lucide-react';
import { Loader } from '../misc/loader';
import { GetGptData, GetGptDataCtx } from '@/src/providers/getGptData';

export function GptCreator() {
	const [disabled, setDisabled] = useState(true);
	const [configVisible, setConfigVisible] = useState(false);
	const [id, setId] = useState(-1);
	const { chatHistory, setChatHistory } = useContext(ClearConvoCtx);
	const {
		setName,
		setDescription,
		setSystemPrompt,
		setTone,
		setStyle,
		setStarters,
	} = useContext(GetGptDataCtx);
	const promptRef = useRef<HTMLTextAreaElement>(null);

	async function handleNewGPTCreatorChat() {
		let newId = await postStartConvo();
		newId = parseInt(JSON.stringify(newId).replace(/[^\d]/g, ''), 10);
		setId(newId);

		const response = await gptBuilderAI({
			conversation: [
				{
					content:
						'Hello Im ready to begin, please start your next message with Hello!',
					role: 'user',
				},
			],
			conversationId: newId,
		});

		if (response) {
			setChatHistory((chatHistory) => {
				return [
					...chatHistory,
					'Hello Im ready to begin, please start your next message with Hello!',
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
	}

	/* The main purpose is to assist with web development code, mainly next js react and typescript and mssql for backend togheter with typescript, I want the assistant to achieve master of web dev programming. I am the only one who will be using the ai, i am a web developer. I would like the ai to be formal but sometimes make some funny informal jokes since i am more of a conservative person haha. The ai should be a little bit geeky, I want to emphasize that the ai is a master of web development and that it should be really good at it and also really good at explaining so it should put alot of effort into explaining things good, if the ai dont know what do answer it should instead give me a caption that could help me find the solution that i can write on google. the ai should not talk about private or sensetive information that it has gotten from me it should also not remember private information.

Example queries that the ai should handle is, how do i make a map loop in react to render multiple components, how do i create a react component acccording to best practices and so on. The ai should always be friendly and ask how my day has been if its the starting conversation and act kinda like a friend to me. */

	const { isLoading } = useQuery({
		queryKey: ['chatGptCreation'],
		queryFn: async () => {
			const newChat = await handleNewGPTCreatorChat();
			return newChat;
		},
		retry: false,
	});

	const { isPending, mutate } = useMutation({
		mutationKey: ['chat'],
		mutationFn: async () => {
			promptRef.current!.value = '';
			setDisabled((prev) => !prev);

			const response = await gptBuilderAI({
				conversation: chatHistory.map((message, i) => ({
					content: message,
					role: `${i % 2 === 0 ? 'user' : 'assistant'}`,
				})),
				conversationId: id,
			});

			if (response) {
				setChatHistory((chatHistory) => {
					return [...chatHistory, response.replaceAll('<br>', '\n')];
				});
				console.log(response);

				/* 				const gptCreationData = parseGPTCreationData(response);
				if (gptCreationData) {
					setName(gptCreationData.NAME);
					setDescription(gptCreationData.DESC);
					setSystemPrompt(gptCreationData.SYSTEM_PROMPT);
					setTone(gptCreationData.TONE);
					setStyle(gptCreationData.STYLE);
					setStarters(gptCreationData.STARTERS);
				} */
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
		<GetGptData>
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
					gptCreationAi={true}
				>
					{isLoading && (
						<div className='ml-6 mt-2'>
							<section className='text-black font-bold flex gap-2 mb-1 text-sm -ml-7'>
								<LucideBot className='size-[1.15rem] -mt-[2px] text-primary' />
								<h4>MinitronAI</h4>
							</section>
							<Loader />
						</div>
					)}
				</ChatRender>

				<ChatForm
					className={configVisible ? 'absolute top-[200rem] sr-only' : ''}
					disabled={disabled}
					onKeyDown={handleKeyDown}
					onChange={handleChange}
					ref={promptRef}
				/>

				<GptConfigure configVisible={configVisible} />
			</div>
		</GetGptData>
	);
}
