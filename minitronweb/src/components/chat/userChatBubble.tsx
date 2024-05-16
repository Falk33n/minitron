import { LucideUserCircle2 } from 'lucide-react';
import { HTMLAttributes } from 'react';
import { cn } from '../../utilities/shadUtilities';
import { MessageParser } from './messageParser';
import { ChatBubbleProps } from '@/src/types/aiTypes';

export type UserChatBubbleProps = HTMLAttributes<HTMLParagraphElement> & {
	message: string | Response;
};

export const UserChatBubble = ({
	className,
	message,
	...props
}: ChatBubbleProps) => {
	return (
		<div>
			<section className='text-black flex gap-2 mb-1 text-sm -ml-7'>
				<LucideUserCircle2 className='size-4 text-muted-foreground' />
				<h4 className='-mt-px font-bold'>You</h4>
			</section>

			<MessageParser
				className={cn(className)}
				{...props}
				text={message}
			/>
		</div>
	);
};

UserChatBubble.displayName = 'UserChatBubble';
