import Link from 'next/link';
import { LiHTMLAttributes, forwardRef } from 'react';
import { cn } from '../utilities/shadUtilities';

export interface AnchorListItemProps extends LiHTMLAttributes<HTMLLIElement> {
	href: string;
}

export const AnchorListItem = forwardRef<HTMLLIElement, AnchorListItemProps>(
	({ className, href, children, ...props }, ref) => {
		return (
			<Link href={href}>
				<li
					className={cn(
						'flex justify-between items-center font-medium bg-primary-tinted py-1.5 px-4 rounded-lg relative hover:bg-navbarList/80 before:content-[""] before:h-px before:w-full before:bg-light before:absolute before:-top-3 before:left-0 [&>svg]:size-5 [&>svg]:text-primary',
						className
					)}
					ref={ref}
					{...props}
				>
					{children}
				</li>
			</Link>
		);
	}
);

AnchorListItem.displayName = 'AnchorListItem';
