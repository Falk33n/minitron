import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utilities/shadUtilities';

export interface UnorderedListProps extends HTMLAttributes<HTMLUListElement> {}

export const UnorderedList = forwardRef<HTMLUListElement, UnorderedListProps>(
	({ className, children, ...props }, ref) => {
		return (
			<ul
				className={cn('flex flex-col gap-2', className)}
				ref={ref}
				{...props}
			>
				{children}
			</ul>
		);
	}
);

UnorderedList.displayName = 'UnorderedList';
