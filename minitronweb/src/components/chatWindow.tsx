'use client';

import { LucideArrowUp } from 'lucide-react';
import { FormHTMLAttributes, forwardRef, useState } from 'react';
import { cn } from '../utilities/shadUtilities';
import { Button } from './ui/button';
import { Input } from './ui/input';

export interface ChatWindowProps extends FormHTMLAttributes<HTMLFormElement> {}

export const ChatWindow = forwardRef<HTMLFormElement, ChatWindowProps>(
	({ className, children, ...props }, ref) => {
		const [prompt, setPrompt] = useState('');

		function handleSubmit() {
			console.log(prompt);
		}

		return (
			<form
				method='post'
				noValidate
				onSubmit={handleSubmit}
				className={cn('flex flex-col mx-auto w-full h-screen px-72', className)}
				ref={ref}
				{...props}
			>
				{children}
				<div className='relative mt-auto h-fit'>
					<Input
						type='text'
						name='prompt'
						aria-label='Ask MinitronAI a question'
						autoComplete='off'
						className='text-base mb-5 font-normal h-10 bg-white w-full rounded-xl border focus-visible:ring-0 focus:border-ring border-light hover:border-ring p-6'
						placeholder='Message MinitronAI'
						required
						onChange={(event) => setPrompt(event.target.value)}
					/>

					<Button
						variant='chat'
						size='icon'
						className='absolute top-[0.3rem] right-3.5'
						title='Send message'
						aria-label='Send message'
						disabled={prompt === ''}
					>
						<LucideArrowUp className='text-muted-foreground' />
					</Button>
				</div>

				<p className='text-muted-foreground text-xs text-center mb-5'>
					MinitronAI can make mistakes. Consider checking important information.
				</p>
			</form>
		);
	}
);

ChatWindow.displayName = 'ChatWindow';
