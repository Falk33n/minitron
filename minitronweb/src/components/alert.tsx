import { cn } from '@/src/utilities/shadUtilities';
import { HTMLAttributes, forwardRef } from 'react';

export type AlertProps = HTMLAttributes<HTMLDivElement> & {
	alertMessage?: string;
};

export const Alert = forwardRef<
	HTMLHeadingElement,
	HTMLAttributes<HTMLHeadingElement> & AlertProps
>(({ alertMessage, className, ...props }, ref) => (
	<h5
		className={cn(
			'font-medium text-xs leading-4 mt-1 text-destructive ',
			className
		)}
		ref={ref}
		{...props}
	>
		{alertMessage}
	</h5>
));

Alert.displayName = 'Alert';
