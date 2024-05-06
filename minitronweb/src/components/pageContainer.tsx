import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '../utilities/shadUtilities';
import { Logo } from './logo';

export type PageContainerProps = HTMLAttributes<HTMLElement> & {
	heading?: string;
	text?: string;
	withLogo?: boolean;
};

export const PageContainer = forwardRef<HTMLElement, PageContainerProps>(
	({ className, withLogo, heading, text, children, ...props }, ref) => {
		return (
			<section
				className={cn(
					'bg-gradientBlue w-[75%] flex flex-col items-center justify-center py-32 rounded-2xl shadow-accounts mx-auto',
					className
				)}
				ref={ref}
				{...props}
			>
				{heading && (
					<h1 className='text-[3rem] text-background font-bold text-center drop-shadow-text'>
						{heading}
					</h1>
				)}

				{withLogo && <Logo />}

				{text && (
					<p className='text-background font-medium opacity-95 text-center drop-shadow-text'>
						{text}
					</p>
				)}

				{children}
			</section>
		);
	}
);

PageContainer.displayName = 'PageContainer';
