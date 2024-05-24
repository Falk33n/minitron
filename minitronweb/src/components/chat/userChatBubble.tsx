import { LucideUserCircle2 } from 'lucide-react';
import { HTMLAttributes } from 'react';
import { cn } from '../../utilities/shadUtilities';
import { MessageParser } from './messageParser';
import { ChatBubbleProps } from '@/src/types/aiTypes';

export const UserChatBubble = ({
	className,
	testAi,
	message,
	...props
}: ChatBubbleProps) => {
	return (
		<div>
			<section className='text-black flex gap-2 mb-2 text-sm -ml-7'>
				<LucideUserCircle2 className='size-4 text-muted-foreground' />
				<h4 className='-mt-px font-bold'>You</h4>
			</section>

			<MessageParser
				className={cn(
					'p-4 rounded-xl w-fit max-w-full',
					testAi && testAi ? 'bg-[#DEDFE0]/60' : 'bg-[#F4F4F4]',
					className
				)}
				{...props}
				text={message}
			/>
		</div>
	);
};

UserChatBubble.displayName = 'UserChatBubble';
