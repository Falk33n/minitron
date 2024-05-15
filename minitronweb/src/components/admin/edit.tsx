'use client';

import { LucidePencil, LucideTrash } from 'lucide-react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export const Edit = () => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				className='hover:bg-black/5 rounded-sm focus-visible:bg-black/5'
				title='Edit user information'
			>
				<LucidePencil
					className='size-5 text-primary'
					aria-label='Click this to open the user editor'
				/>
			</DropdownMenuTrigger>
			<DropdownMenuContent className=''>
				<DropdownMenuItem className=''>
					<LucidePencil aria-label='Edit user' />
					<LucideTrash aria-label='Delete user' />
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
