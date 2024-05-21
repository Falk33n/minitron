'use client';

import { LucidePencil, LucideTrash } from 'lucide-react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/src/components/ui/dialog';
import { useState } from 'react';
import { Label } from '../forms/label';
import { Input } from '../forms/input';
import { Button } from '../forms/button';
import { useQuery } from '@tanstack/react-query';
import { Loader } from '../misc/loader';
import { getSingleUser } from '@/src/helpers';
import { SingleUserType } from '@/src/types/adminTypes';
import { toast } from '../ui/use-toast';

export const Edit = ({ id }: { id: string }) => {
	const [enableRemoval, setEnbableRemoval] = useState(false);
	const [userData, setUserData] = useState<SingleUserType>({
		fullName: '',
		email: '',
	});
	const { isLoading, refetch } = useQuery({
		queryKey: ['getUserDetails'],
		queryFn: async () => {
			const res = await getSingleUser(id);
			if (res) return setUserData(res);
			return toast({
				variant: 'destructive',
				title: 'Error!',
				description: 'Could not save changes. Please try again.',
			});
		},
		retry: false,
		enabled: false,
	});

	return (
		<>
			<Dialog>
				<DialogTrigger
					onClick={() => {
						setEnbableRemoval(false);
						refetch();
					}}
				>
					<Button
						className='absolute top-1/2 -translate-y-1/2 right-4 p-1'
						variant={'outline'}
						title='Edit user information'
						aria-label='Edit user information'
					>
						<LucidePencil className='size-5 text-primary' />
					</Button>
				</DialogTrigger>
				<DialogContent className='sm:max-w-[425px]'>
					<DialogHeader>
						<DialogTitle>Edit profile</DialogTitle>
						<DialogDescription>
							Make changes to the profile here. Click save when you're done.
						</DialogDescription>
					</DialogHeader>
					<div className='grid gap-4 py-4'>
						<div className='grid grid-cols-4 items-center gap-4'>
							<Label
								htmlFor='fullName'
								className='text-right'
							>
								Full Name
							</Label>
							<Input
								id='fullName'
								defaultValue={userData.fullName}
								className='col-span-3'
							/>
						</div>
						<div className='grid grid-cols-4 items-center gap-4'>
							<Label
								htmlFor='email'
								className='text-right'
							>
								Email
							</Label>
							<Input
								id='email'
								defaultValue={userData.email}
								className='col-span-3'
							/>
						</div>
					</div>
					<DialogFooter className='sm:justify-between'>
						<Button
							variant='destructive'
							disabled={enableRemoval}
							onClick={() => setEnbableRemoval(true)}
						>
							{enableRemoval ? 'Will remove user on save ✔' : 'Delete User'}
						</Button>
						<Button type='submit'>
							{isLoading ? <Loader sm /> : 'Save changes'}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
};
