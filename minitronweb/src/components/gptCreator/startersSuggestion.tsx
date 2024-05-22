import { LucideX } from 'lucide-react';
import { useState } from 'react';
import { Input } from '../forms/input';
import { ControllerRenderProps, useFormContext } from 'react-hook-form';

export function StartersSuggestion({
	i,
	field,
}: {
	i: number;
	field: ControllerRenderProps<
		{
			name: string;
			desc: string;
			instructions: string;
			starters: {
				starter: string;
			}[];
		},
		`starters.${number}.starter`
	>;
}) {
	const { setValue } = useFormContext();

	return (
		<>
			<Input
				type='text'
				autoComplete='off'
				placeholder={i > 3 ? 'Optional' : 'Required'}
				required={i > 3 ? false : true}
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
