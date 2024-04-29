import { cn } from '@/src/utilities/shadUtilities';
import Link from 'next/link';
import { AnchorHTMLAttributes, ReactNode, forwardRef } from 'react';

export type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
	paragraph?: ReactNode;
	link: ReactNode;
	href: string;
};

export const AnchorLink = forwardRef<HTMLAnchorElement, LinkProps>(
	({ className, paragraph, link, href, ...props }, ref) => {
		return (
			<p className={'text-center'}>
				{paragraph && paragraph + ' '}
				<Link
					href={'/' + href}
					className={cn(
						'text-primary focus-visible:outline-primary focus-visible:outline-offset-2 ',
						className
					)}
					ref={ref}
					{...props}
				>
					{link}
				</Link>
			</p>
		);
	}
);

AnchorLink.displayName = 'Button';
