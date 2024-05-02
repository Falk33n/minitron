'use client';

import { LucideSend } from 'lucide-react';
import { FormHTMLAttributes, forwardRef } from 'react';
import { cn } from '../utilities/shadUtilities';
import { Button } from './ui/button';
import { Input } from './ui/input';

export interface ChatWindowProps extends FormHTMLAttributes<HTMLFormElement> {}

export const ChatWindow = forwardRef<HTMLFormElement, ChatWindowProps>(
	({ className, children, ...props }, ref) => {
		return (
			<form
				className={cn('flex flex-col mx-auto w-full h-screen px-56', className)}
				ref={ref}
				{...props}
			>
				{children}
				<div className='relative mt-auto h-fit'>
					<Input
						type='text'
						name='prompt'
						aria-label='Ask MinitronAI a question'
						className='text-base mb-5 font-normal h-10 bg-background w-full rounded-xl border focus-visible:ring-0 focus:border-ring border-light hover:border-ring px-3 py-6'
						placeholder='Message MinitronAI'
					/>
					<Button
						variant='chat'
						size='icon'
						className='absolute top-[0.3rem] right-5'
						title='Send message'
						aria-label='Send message'
					>
						<LucideSend className='rotate-45 text-muted-foreground' />
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
