'use client';

import { AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { HTMLAttributes, forwardRef, useEffect } from 'react';
import { cn } from '../../utilities/shadUtilities';
import { AlertDescription, AlertTitle, Alerts } from '../ui/alerts';

export type NotAllowedProps = HTMLAttributes<HTMLDivElement> & {};

export const NotAllowed = forwardRef<HTMLDivElement, NotAllowedProps>(
	({ className, ...props }, ref) => {
		const router = useRouter();

		useEffect(() => {
			setTimeout(() => router.push('/'), 7500);
		});

		return (
			<div
				className={cn(
					'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center gap-10 px-[30rem] h-screen bg-white y z-[20] text-center w-full',
					className
				)}
				ref={ref}
				{...props}
			>
				<Alerts
					variant='destructive'
					className='w-[22rem]'
				>
					<AlertCircle className='size-4' />
					<AlertTitle>Error!</AlertTitle>
					<AlertDescription>
						You are not authenticated. Rederecting...
					</AlertDescription>
				</Alerts>
			</div>
		);
	}
);

NotAllowed.displayName = 'NotAllowed';
