import { ImgHTMLAttributes, forwardRef } from 'react';
import { cn } from '../utilities/shadUtilities';

export type LogoProps = ImgHTMLAttributes<HTMLImageElement> & {};

export const Logo = forwardRef<HTMLImageElement, LogoProps>(
	({ className, ...props }, ref) => {
		return (
			<figure>
				<img
					className={cn(className)}
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
