import Image from 'next/image';
import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '../utilities/shadUtilities';

export type LogoProps = HTMLAttributes<HTMLImageElement> & {};

export const Logo = forwardRef<HTMLImageElement, LogoProps>(
	({ className, ...props }, ref) => {
		return (
			<figure>
				<Image
					className={cn(className)}
					width={144}
					height={144}
					src='/robot.png'
					alt='A animated robot that represents Minitrons mascot'
					draggable='false'
					ref={ref}
					{...props}
				/>
			</figure>
		);
	}
);

Logo.displayName = 'Logo';
