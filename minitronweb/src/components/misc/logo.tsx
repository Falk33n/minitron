import Image from 'next/image';
import Link from 'next/link';
import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utilities/shadUtilities';

export type LogoProps = HTMLAttributes<HTMLImageElement> & {};

export const Logo = forwardRef<HTMLImageElement, LogoProps>(
	({ className, ...props }, ref) => {
		return (
			<figure>
				<Link
					href='/'
					aria-label='Go to Minitron Homepage'
					title='Go to Minitron Homepage'
				>
					<Image
						className={cn(
							'rounded-full drop-shadow-logo my-20 drag-none',
							className
						)}
						width={144}
						height={144}
						priority
						src='/robot.png'
						alt='A animated robot that represents Minitrons mascot'
						draggable='false'
						ref={ref}
						{...props}
					/>
				</Link>
			</figure>
		);
	}
);

Logo.displayName = 'Logo';
