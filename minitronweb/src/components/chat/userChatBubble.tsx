import { LucideUserCircle2 } from 'lucide-react';
import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utilities/shadUtilities';

export type UserChatBubbleProps = HTMLAttributes<HTMLParagraphElement> & {
	message: string;
};

export const UserChatBubble = forwardRef<
	HTMLParagraphElement,
	UserChatBubbleProps
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

			<section className='text-muted-foreground flex gap-2 absolute -bottom-7 right-3.5 text-sm'>
				<h4 className='-mt-px'>You</h4>
				<LucideUserCircle2 className='size-4' />
			</section>
		</>
	);
});

UserChatBubble.displayName = 'UserChatBubble';
