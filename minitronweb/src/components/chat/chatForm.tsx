'use client';

import { Button, Loader } from '@/src/components';
import { getSession } from '@/src/helpers';
import { useQuery } from '@tanstack/react-query';
import { LucideArrowUp } from 'lucide-react';
import {
	ChangeEventHandler,
	KeyboardEventHandler,
	MouseEventHandler,
	TextareaHTMLAttributes,
	forwardRef,
	useState,
} from 'react';
import { cn } from '../../utilities/shadUtilities';

export type ChatFormProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
	onKeyDown: KeyboardEventHandler<HTMLTextAreaElement>;
	onClick?: MouseEventHandler<HTMLButtonElement>;
	onChange: ChangeEventHandler<HTMLTextAreaElement>;
	disabled?: boolean;
	testAi?: boolean;
};

export const ChatForm = forwardRef<HTMLTextAreaElement, ChatFormProps>(
	(
		{
			className,
			disabled,
			testAi,
			onChange,
			onClick,
			onKeyDown,
			children,
			...props
		},
		ref
	) => {
		const [focusChatBar, setFocusChatBar] = useState(false);
		const { isLoading, error } = useQuery({
			queryKey: ['session'],
			queryFn: getSession,
			retry: false,
		});

		return (
			<form
				method='post'
				noValidate
				className={cn(
					'rounded-t-xl sticky bottom-0 w-[80%]',
					testAi && testAi ? 'bg-[#F7F8F9]' : 'bg-white',
					className
				)}
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
						className='resize-none w-full focus-visible:outline-none bg-white min-h-10 p-4 pr-16 rounded-2xl overflow-y-auto'
						placeholder='Message MinitronAI'
						required
						onKeyDown={onKeyDown}
						onChange={onChange}
						onFocus={() => {
							setFocusChatBar(true);
						}}
						onBlur={() => {
							setFocusChatBar(false);
						}}
						rows={1}
						ref={ref}
						{...props}
					/>

					<Button
						variant='icon'
						size='icon'
						className='absolute bottom-2 right-4'
						title='Send message'
						aria-label='Send message'
						type='submit'
						disabled={disabled}
						onClick={onClick}
						onFocus={() => {
							setFocusChatBar(true);
						}}
						onBlur={() => {
							setFocusChatBar(false);
						}}
					>
						{isLoading ? (
							<Loader sm={true} />
						) : (
							<LucideArrowUp className='text-muted-foreground size-full scale-75 p-1 bg-muted rounded-2xl hover:bg-primary/10 focus-visible:bg-primary/10' />
						)}
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
