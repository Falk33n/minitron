'use client';

import { gptBuilderAI, postStartConvo } from '@/src/helpers';
import { ClearConvoCtx } from '@/src/providers/clearConvo';
import { GetGptDataCtx } from '@/src/providers/getGptData';
import { useMutation, useQuery } from '@tanstack/react-query';
import { LucideBot } from 'lucide-react';
import { KeyboardEvent, useContext, useEffect, useRef, useState } from 'react';
import { useConvo } from '../../hooks/useConvo';
import { ChatForm } from '../chat/chatForm';
import { ChatRender } from '../chat/chatRender';
import { Button } from '../forms/button';
import { Loader } from '../misc/loader';
import { toast } from '../ui/use-toast';
import { GptConfigure } from './gptConfigure';

export function GptCreator() {
	const [disabled, setDisabled] = useState(true);
	const [configVisible, setConfigVisible] = useState(false);
	const [id, setId] = useState(-1);
	const [convoId, updateConvoId] = useConvo();
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

	async function handleNewGPTCreatorChat() {
		let newId = await handleNewChat();

		const response = await gptBuilderAI({
			conversation: [
				{
					content:
						"You are an AI assistant designed to help users create a custom AI system prompt. To gather the necessary details, you interview the user with the following questions, but not all at once.: 1. Purpose and Goals: What is the main purpose of your AI assistant? What goals do you want to achieve? 2. Target Audience: Who will be using this AI assistant? Any specific characteristics or needs of this audience? 3. Tone and Style: Should the AI's tone be formal or informal? Any particular personality traits? 4. Key Functions and Capabilities: What functions should the assistant perform? Any key features to emphasize? 5. Content and Knowledge Scope: What topics should the assistant focus on? Any topics to avoid? 6. Interaction Preferences: How should the assistant handle complex or unclear queries? Any preferred interaction styles? 7. Privacy and Security: Any privacy or security considerations? How should sensitive information be handled? 8. Example Scenarios: Provide some example scenarios or queries. How should the assistant respond? Once you have the user's responses, confirm their satisfaction. If they are satisfied, generate and send the new system prompt as a single string. Start the conversation in a friendly and welcoming tone, without explicitly mentioning the system prompt. Instead, say you are helping them create a custom AI. Mark the system prompt with quotes and inside it should be the full system prompt, and after that include the following quotes the name and it should contain a suggested name for the AI in quotes. Description inside quites and inside it should be a brief description of what the AI. The tone in quotes containing the desired tone of the AI. The style of the AI inside quotes. And lastly Starters and inside this quote it should contain four distinct conversation starter examples. Remember not to quote the titles of the different values, only quote the values. You should make a short summary first of the ai that is not quoted or doesnt have any specifics. After the summary you should put the actual values we want to come you should seperate these with ::INFORMATION:: followed by the values we want. Never forget to quote the values and always remember to use a digit before each starters quote. Never use single quotes. Remember to make the starters values sound like the user is asking a question to you the AI Assistant.",
					role: 'system',
				},
			],
			conversationId: id !== -1 ? id : (await handleNewChat())!,
		});

		if (response) {
			setChatHistory((chatHistory) => {
				return [
					...chatHistory,
					"You are an AI assistant designed to help users create a custom AI system prompt. To gather the necessary details, you interview the user with the following questions, but not all at once.: 1. Purpose and Goals: What is the main purpose of your AI assistant? What goals do you want to achieve? 2. Target Audience: Who will be using this AI assistant? Any specific characteristics or needs of this audience? 3. Tone and Style: Should the AI's tone be formal or informal? Any particular personality traits? 4. Key Functions and Capabilities: What functions should the assistant perform? Any key features to emphasize? 5. Content and Knowledge Scope: What topics should the assistant focus on? Any topics to avoid? 6. Interaction Preferences: How should the assistant handle complex or unclear queries? Any preferred interaction styles? 7. Privacy and Security: Any privacy or security considerations? How should sensitive information be handled? 8. Example Scenarios: Provide some example scenarios or queries. How should the assistant respond? Once you have the user's responses, confirm their satisfaction. If they are satisfied, generate and send the new system prompt as a single string. Start the conversation in a friendly and welcoming tone, without explicitly mentioning the system prompt. Instead, say you are helping them create a custom AI. Mark the system prompt with quotes and inside it should be the full system prompt, and after that include the following quotes the name and it should contain a suggested name for the AI in quotes. Description inside quites and inside it should be a brief description of what the AI. The tone in quotes containing the desired tone of the AI. The style of the AI inside quotes. And lastly Starters and inside this quote it should contain four distinct conversation starter examples. Remember not to quote the titles of the different values, only quote the values. You should make a short summary first of the ai that is not quoted or doesnt have any specifics. After the summary you should put the actual values we want to come you should seperate these with ::INFORMATION:: followed by the values we want. Never forget to quote the values and always remember to use a digit before each starters quote. Never use single quotes. Remember to make the starters values sound like the user is asking a question to you the AI Assistant. Remember include all the specific values in the particular order I have given you.",
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

	function getValues(values: string[], res: string) {
		const matches = res.match(/"([^"]*)"/g);
		if (matches) {
			matches?.forEach((match, i) => {
				values.push(match.slice(1, -1));
			});

			if (values) {
				const starters = values[6].match(/\d([^0-9]*)/g);

				setSystemPrompt(values[1]);
				setName(values[2]);
				setDescription(values[3]);
				setTone(values[4]);
				setStyle(values[5]);

				if (starters) {
					setStarters(
						starters.map((starter) => ({
							starter: starter,
						}))
					);
					return;
				}

				const startersArray: string[] = [];
				startersArray.push(values[6]);
				startersArray.push(values[7]);
				startersArray.push(values[8]);
				startersArray.push(values[9]);
				setStarters(startersArray.map((starter) => ({ starter: starter })));
			}
		}
	}

	const { isPending, mutate } = useMutation({
		mutationKey: ['chat'],
		mutationFn: async () => {
			let configArray: string[] = [''];
			promptRef.current!.value = '';
			setDisabled((prev) => !prev);

			const response = await gptBuilderAI({
				conversation: chatHistory.map((message, i) => ({
					content: message,
					role: `${i === 0 ? 'system' : i % 2 === 0 ? 'user' : 'assistant'}`,
				})),
				conversationId: id,
			});

			if (response) {
				getValues(configArray, response);
				setChatHistory((chatHistory) => {
					return [
						...chatHistory,
						response
							.replaceAll('<br>', '\n')
							.replaceAll('::INFORMATION::', '')
							.replaceAll('::', ''),
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
			const lineHeight = parseInt(
				getComputedStyle(promptRef.current).lineHeight,
				10
			);
			const padding =
				parseInt(getComputedStyle(promptRef.current).paddingTop, 10) * 2;
			promptRef.current.style.height = `${lineHeight + padding}px`;
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
	}, [chatHistory, configVisible]);

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
	);
}
