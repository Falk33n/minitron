'use client';

import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import { cn } from '@/src/utilities/shadUtilities';
import {
	ComponentPropsWithoutRef,
	ElementRef,
	ReactNode,
	forwardRef,
} from 'react';

export type CheckboxProps = {
	label?: ReactNode;
};

export const Checkbox = forwardRef<
	ElementRef<typeof CheckboxPrimitive.Root>,
	CheckboxProps & ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, id, label, ...props }, ref) => (
	<label>
		<CheckboxPrimitive.Root
			ref={ref}
			id={id}
			className={cn(
				'peer size-4 mr-2 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
				className
			)}
			{...props}
		>
			<CheckboxPrimitive.Indicator
				className={cn(
					'flex items-center justify-center text-current data-[state=checked]:-mt-2'
				)}
			>
				<Check className='size-4 -mb-2' />
			</CheckboxPrimitive.Indicator>
		</CheckboxPrimitive.Root>
		{label && label}
	</label>
));

Checkbox.displayName = CheckboxPrimitive.Root.displayName;
