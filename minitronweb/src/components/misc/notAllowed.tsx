import Link from 'next/link';
import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utilities/shadUtilities';

export type NotAllowedProps = HTMLAttributes<HTMLElement> & {
	message?: string;
};

export const NotAllowed = forwardRef<HTMLElement, NotAllowedProps>(
	({ className, message, ...props }, ref) => {
		return (
			<section
				className={cn(
					'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center gap-10 px-[30rem] w-full h-screen bg-gradientGray z-[20] text-center',
					className
				)}
				ref={ref}
				{...props}
			>
				<h1 className='text-5xl font-extrabold text-red-700'>Error!</h1>
				<p>{message}</p>
				<Link
					className='bg-primary py-2 px-7 text-white rounded-full hover:bg-primary/90'
					href='/'
				>
					Go to Homepage
				</Link>
			</section>
		);
	}
);

NotAllowed.displayName = 'NotAllowed';
