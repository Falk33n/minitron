import { LucideBot } from 'lucide-react';
import { HTMLAttributes } from 'react';
import { cn } from '../../utilities/shadUtilities';
import { MessageParser } from './messageParser';

export type RobotChatBubbleProps = HTMLAttributes<HTMLElement> & {
	message: string;
};

export const RobotChatBubble = ({
	className,
	message,
	...props
}: RobotChatBubbleProps) => {
	return (
		<div>
			<section className='text-black font-bold flex gap-2 mb-1 text-sm -ml-7'>
				<LucideBot className='size-[1.15rem] -mt-[2px] text-primary' />
				<h4>MinitronAI</h4>
			</section>

			<MessageParser
				className={cn(className)}
				{...props}
				text={message}
			/>
		</div>
	);
};

RobotChatBubble.displayName = 'RobotChatBubble';
