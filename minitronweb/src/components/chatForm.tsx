'use client';

import { Button, Input } from '@/src/components';
import { LucideArrowUp } from 'lucide-react';
import {
	ChangeEventHandler,
	FormEventHandler,
	FormHTMLAttributes,
	forwardRef,
} from 'react';
import { cn } from '../utilities/shadUtilities';

export type ChatFormProps = FormHTMLAttributes<HTMLFormElement> & {
	onSubmit: FormEventHandler<HTMLFormElement>;
	onChange: ChangeEventHandler<HTMLInputElement>;
	prompt: string;
};

export const ChatForm = forwardRef<HTMLFormElement, ChatFormProps>(
	({ className, onSubmit, prompt, onChange, children, ...props }, ref) => {
		return (
			<form
				method='post'
				noValidate
				className={cn(
					'bg-gradientGray rounded-t-xl sticky bottom-0',
					className
				)}
				ref={ref}
				{...props}
				onSubmit={onSubmit}
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
						value={prompt}
						onChange={onChange}
					/>

					<Button
						variant='chat'
						size='icon'
						className='absolute top-[0.3rem] right-3.5'
						title='Send message'
						aria-label='Send message'
						type='submit'
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

ChatForm.displayName = 'ChatForm';
