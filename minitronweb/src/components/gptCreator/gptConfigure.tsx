'use client';

import { useFieldArray, useForm } from 'react-hook-form';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../forms/form';
import { Input } from '../forms/input';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { StartersSuggestion } from './startersSuggestion';
import { KeyboardEvent, useRef } from 'react';
import { Button } from '../forms/button';

const formSchema = z.object({
	name: z
		.string()
		.trim()
		.regex(/^((?!\.)[\w_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gi, {
			message:
				'The value of the email and password does not match to any registered account.',
		}),
	desc: z.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{12,}$/, {
		message: '',
	}),
	instructions: z.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{12,}$/, {
		message: '',
	}),
	starters: z.array(
		z.object({
			starter: z.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{12,}$/, {
				message:
					'Password must contain at least one digit, one lowercase letter, one uppercase letter, and be at least 12 characters long',
			}),
		})
	),
});

export function GptConfigure({ configVisible }: { configVisible: boolean }) {
	const promptRef = useRef<HTMLTextAreaElement>(null);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
			desc: '',
			instructions: '',
			starters: Array(10).fill({ starter: '' }),
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
		}
	}

	function handleChange() {
		if (!promptRef.current) return;

		promptRef.current.style.height = '0px';
		const textarea = promptRef.current;
		const lineHeight = parseInt(getComputedStyle(textarea).lineHeight, 10);
		const padding = parseInt(getComputedStyle(textarea).paddingTop, 10) * 2;
		const maxHeight = lineHeight * 10 + padding;
		const scrollHeight = textarea.scrollHeight;
		textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
	}

	async function onSubmit(values: z.infer<typeof formSchema>) {
		/* const response = await postLogIn(values);

		if (response) {
			toast({
				variant: 'success',
				title: 'Success!',
				description: 'You have successfully logged in.',
			});
			router.push('/chat');
		} else {
			toast({
				variant: 'destructive',
				title: 'Error!',
				description: 'Something went wrong. Please try again.',
			});
		}
		return response; */
	}

	const { fields } = useFieldArray({
		control: form.control,
		name: 'starters',
	});

	return (
		<Form {...form}>
			<form
				noValidate
				method='post'
				onSubmit={form.handleSubmit(onSubmit)}
				className={`w-[75%] h-full bg-white flex flex-col gap-8 rounded-l-2xl px-16 py-12 mb-36 ${
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
								<Input
									type='text'
									autoComplete='off'
									placeholder='Brief description of the AI'
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
									className='resize-none w-full rounded-md text-sm ring-offset-background border border-input bg-background bg-background placeholder:text-muted-foreground min-h-10 p-4 overflow-y-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1'
									placeholder='The instructions given to the AI'
									required
									{...field}
									onKeyDown={handleKeyDown}
									onChange={handleChange}
									rows={3}
									ref={promptRef}
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
					className='w-[80%] mx-auto mt-5'
					type='submit'
				>
					Save "name of ai"AI to your profile
				</Button>
			</form>
		</Form>
	);
}
