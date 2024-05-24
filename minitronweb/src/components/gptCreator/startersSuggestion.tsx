import { LucideX } from 'lucide-react';
import { useState } from 'react';
import { Input } from '../forms/input';
import { ControllerRenderProps, useFormContext } from 'react-hook-form';

export function StartersSuggestion({
	i,
	field,
	starters,
}: {
	i: number;
	field: ControllerRenderProps<
		{
			name: string;
			desc: string;
			tone: string;
			style: string;
			instructions: string;
			starters: {
				starter: string;
			}[];
		},
		`starters.${number}.starter`
	>;
	starters: string;
}) {
	const { setValue } = useFormContext();

	return (
		<>
			<Input
				type='text'
				autoComplete='off'
				placeholder='E.g. How do I bake a cake'
				required
				defaultValue={starters}
				{...field}
			/>

			<button
				className='absolute top-1 text-muted-foreground focus-visible:outline-primary focus-visible:text-black hover:text-black right-2'
				aria-label='Clear input'
				title='Clear input'
				onClick={() => setValue(`starters.${i}.starter`, '')}
				type='button'
			>
				<LucideX
					className='size-3.5'
					aria-hidden
				/>
			</button>
		</>
	);
}
