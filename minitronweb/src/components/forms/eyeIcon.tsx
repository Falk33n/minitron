import { Eye, EyeOff } from 'lucide-react';
import { Dispatch, HTMLAttributes, SetStateAction, forwardRef } from 'react';

export interface EyeIconProps extends HTMLAttributes<HTMLElement> {
	isPasswordVisible: boolean;
}

export const EyeIcon = forwardRef<HTMLElement, EyeIconProps>(
	({ className, isPasswordVisible, ...props }, ref) => {
		return (
			<figure
				className='cursor-pointer text-primary focus-visible:outline-offset-[3px] focus-visible:outline-primary absolute right-3 -top-1'
				ref={ref}
				{...props}
			>
				{isPasswordVisible ? (
					<Eye className='size-5' />
				) : (
					<EyeOff className='size-5' />
				)}
			</figure>
		);
	}
);

EyeIcon.displayName = 'EyeIcon';
