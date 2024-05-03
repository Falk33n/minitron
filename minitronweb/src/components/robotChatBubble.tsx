import { LucideBot } from 'lucide-react';
import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '../utilities/shadUtilities';

export type RobotChatBubbleProps = HTMLAttributes<HTMLParagraphElement> & {
	message: string;
};

export const RobotChatBubble = forwardRef<
	HTMLParagraphElement,
	RobotChatBubbleProps
>(({ className, message, ...props }, ref) => {
	return (
		<>
			<p
				className={cn(className)}
				ref={ref}
				{...props}
			>
				{message}
			</p>

			<section className='text-muted-foreground flex gap-2 absolute -bottom-[1.85rem] left-3.5 text-sm'>
				<LucideBot className='size-[1.15rem] -mt-[2px]' />
				<h4>MinitronAI</h4>
			</section>
		</>
	);
});

RobotChatBubble.displayName = 'RobotChatBubble';
