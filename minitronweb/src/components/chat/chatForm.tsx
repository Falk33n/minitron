'use client';

import { Button } from '@/src/components';
import { LucideArrowUp } from 'lucide-react';
import {
	ChangeEventHandler,
	FormEventHandler,
	FormHTMLAttributes,
	forwardRef,
	useState,
} from 'react';
import { cn } from '../../utilities/shadUtilities';

export type ChatFormProps = FormHTMLAttributes<HTMLFormElement> & {
	onSubmit: FormEventHandler<HTMLFormElement>;
	onChange: ChangeEventHandler<HTMLTextAreaElement>;
	prompt: string;
};

export const ChatForm = forwardRef<HTMLFormElement, ChatFormProps>(
	({ className, onSubmit, prompt, onChange, children, ...props }, ref) => {
		const [focusChatBar, setFocusChatBar] = useState(false);

		return (
			<form
				method='post'
				noValidate
				className={cn('bg-white rounded-t-xl sticky bottom-0', className)}
				ref={ref}
				{...props}
				onSubmit={onSubmit}
			>
				{children}

				<div
					className={`relative flex mt-auto border h-fit mb-5 border-light rounded-2xl ${
						focusChatBar ? 'border-primary border-2' : ''
					}`}
				>
					<textarea
						name='prompt'
						aria-label='Ask MinitronAI a question'
						autoComplete='off'
						className='resize-none w-full focus-visible:outline-none min-h-10 max-h-auto p-4 pr-16 rounded-2xl overflow-hidden'
						placeholder='Message MinitronAI'
						required
						value={prompt}
						onChange={onChange}
						onFocus={() => {
							setFocusChatBar(true);
						}}
						onBlur={() => {
							setFocusChatBar(false);
						}}
						rows={1}
					/>

					<Button
						variant='icon'
						size='icon'
						className='absolute top-[0.3rem] right-3.5'
						title='Send message'
						aria-label='Send message'
						type='submit'
						disabled={prompt === ''}
						onFocus={() => {
							setFocusChatBar(true);
						}}
						onBlur={() => {
							setFocusChatBar(false);
						}}
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
