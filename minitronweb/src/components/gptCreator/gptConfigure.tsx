'use client';

import { createNewGpt, getCurrentUser } from '@/src/helpers';
import { GetGptDataCtx } from '@/src/providers/getGptData';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { KeyboardEvent, useContext, useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { ClearConvoCtx } from '../../providers/clearConvo';
import { Button } from '../forms/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../forms/form';
import { Input } from '../forms/input';
import { toast } from '../ui/use-toast';
import { StartersSuggestion } from './startersSuggestion';

const formSchema = z.object({
	name: z.string().trim().regex(/^.+$/, {
		message: 'Please fill in the Name field',
	}),
	desc: z.string().trim().regex(/^.+$/, {
		message: 'Please fill in the Description field',
	}),
	instructions: z.string().trim().regex(/^.+$/, {
		message: 'Please fill in the Instructions field',
	}),
	tone: z.string().trim().regex(/^.+$/, {
		message: 'Please fill in the Tone field',
	}),
	style: z.string().trim().regex(/^.+$/, {
		message: 'Please fill in the Style field',
	}),
	starters: z.array(
		z.object({
			starter: z.string().trim().regex(/^.+$/, {
				message: 'Please fill in all the required Starter fields',
			}),
		})
	),
});

export function GptConfigure({ configVisible }: { configVisible: boolean }) {
	const { name, description, systemPrompt, tone, style, starters } =
		useContext(GetGptDataCtx);
	const { chatHistory, setNewChat, setForceClear } = useContext(ClearConvoCtx);
	const router = useRouter();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: name || '',
			desc: description || '',
			instructions: systemPrompt || '',
			tone: tone || '',
			style: style || '',
			starters: starters?.length
				? starters.map((starter) => ({ starter: starter.starter }))
				: Array(4).fill({ starter: '' }),
		},
	});

	function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
		e.currentTarget.style.height = '0px';
		const textarea = e.currentTarget;
		const lineHeight = parseInt(getComputedStyle(textarea).lineHeight, 10);
		const padding = parseInt(getComputedStyle(textarea).paddingTop, 10) * 2;
		const maxHeight = lineHeight * 10 + padding;
		const scrollHeight = textarea.scrollHeight;

		textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
		if (e.key === 'Enter' && e.shiftKey) textarea.value += '\n';
	}

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const id = (await getCurrentUser()).id;
		const res = await createNewGpt({
			id: id,
			name: values.name,
			description: values.desc,
			systemPrompt: values.instructions,
			tone: values.tone,
			style: values.style,
			starters: values.starters.map((starter) => starter.starter),
		});

		if (res) {
			toast({
				variant: 'success',
				title: 'Success!',
				description: `${values.name}AI successfully created!`,
			});

			setNewChat(true);
			setForceClear(true);
			router.push('/chat');
		} else {
			toast({
				variant: 'destructive',
				title: 'Error!',
				description: 'Something went wrong. Please try again.',
			});
		}
		return res;
	}

	const { fields } = useFieldArray({
		control: form.control,
		name: 'starters',
	});

	useEffect(() => {
		form.reset({
			name: name || '',
			desc: description || '',
			instructions: systemPrompt || '',
			tone: tone || '',
			style: style || '',
			starters: starters?.length
				? starters.map((starter) => ({ starter: starter.starter }))
				: Array(4).fill({ starter: '' }),
		});
	}, [name, description, systemPrompt, tone, style, starters, form]);

	return (
		<Form {...form}>
			<form
				noValidate
				method='post'
				onSubmit={form.handleSubmit(onSubmit)}
				className={`w-[75%] h-fit bg-white flex flex-col gap-8 rounded-l-2xl px-16 pt-12 ${
					!configVisible ? 'absolute top-[200rem] sr-only' : ''
				}`}
			>
				<FormField
					control={form.control}
					name='name'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>

							<FormControl>
								<Input
									type='text'
									placeholder='Name of the AI'
									autoComplete='off'
									required
									{...field}
								/>
							</FormControl>

							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='desc'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Description</FormLabel>
							<FormControl>
								<textarea
									autoComplete='off'
									className='resize-none w-full rounded-md text-sm ring-offset-background border border-input bg-background bg-background placeholder:text-muted-foreground min-h-24 p-4 overflow-y-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1'
									placeholder='The instructions given to the AI'
									required
									rows={1}
									onKeyDown={handleKeyDown}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='tone'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Tone</FormLabel>
							<FormControl>
								<Input
									type='text'
									autoComplete='off'
									placeholder='Set the tone of the AI (E.g. formal, informal)'
									required
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='style'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Style</FormLabel>
							<FormControl>
								<Input
									type='text'
									autoComplete='off'
									placeholder='Set the personality of the AI'
									required
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='instructions'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Instructions</FormLabel>
							<FormControl>
								<textarea
									autoComplete='off'
									className='resize-none w-full rounded-md text-sm ring-offset-background border border-input bg-background bg-background placeholder:text-muted-foreground min-h-24 p-4 overflow-y-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1'
									placeholder='The instructions given to the AI'
									required
									rows={3}
									onKeyDown={handleKeyDown}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<section>
					<h6 className='font-medium text-sm'>Conversation Starters</h6>
					{fields.map((field, i) => (
						<FormField
							key={i}
							control={form.control}
							name={`starters.${i}.starter`}
							render={({ field }) => (
								<FormItem className='relative'>
									<FormLabel className='sr-only'>
										Conversation Starter {i + 1}
									</FormLabel>
									<FormControl>
										<>
											<StartersSuggestion
												i={i}
												field={field}
											/>
										</>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					))}
				</section>

				<Button
					className='w-[80%] mx-auto mt-5 mb-14'
					type='submit'
				>
					Save {form.getValues().name}AI to your profile
				</Button>
			</form>
		</Form>
	);
}
