import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '../utilities/shadUtilities';

export interface UnorderedListProps extends HTMLAttributes<HTMLUListElement> {}

export const UnorderedList = forwardRef<HTMLUListElement, UnorderedListProps>(
	({ className, children, ...props }, ref) => {
		return (
			<ul
				className={cn(
					'flex flex-col gap-6 before:content-[""] before:h-px before:w-full before:bg-light before:absolute before:left-0 before:-bottom-3',
					className
				)}
				ref={ref}
				{...props}
			>
				{children}
			</ul>
		);
	}
);

UnorderedList.displayName = 'UnorderedList';
