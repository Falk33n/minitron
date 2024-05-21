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
import { useRef, useState } from 'react';
import { Label } from '../forms/label';
import { Input } from '../forms/input';
import { Button } from '../forms/button';
import { useQuery } from '@tanstack/react-query';
import { Loader } from '../misc/loader';
import { deleteSingleUser, editUser, getSingleUser } from '@/src/helpers';
import { toast } from '../ui/use-toast';

export const Edit = ({
	userId,
	refetch,
}: {
	userId: string;
	refetch: () => Promise<unknown>;
}) => {
	const [enableRemoval, setEnbableRemoval] = useState(false);
	const [render, setRender] = useState(true);

	return (
		<>
			<Dialog>
				<DialogTrigger
					onClick={() => {
						setEnbableRemoval(false);
					}}
					className='absolute top-1/2 -translate-y-1/2 right-4 p-1'
					title='Edit user information'
					aria-label='Edit user information'
				>
					<LucidePencil className='size-5 text-primary' />
				</DialogTrigger>
				{render && (
					<DialogContent className='sm:max-w-[425px]'>
						<EditContent
							refetch={refetch}
							userId={userId}
							enableRemoval={enableRemoval}
							setEnableRemoval={(value) => setEnbableRemoval(value)}
							setRender={(value) => setRender(value)}
						/>
					</DialogContent>
				)}
			</Dialog>
		</>
	);
};

export const EditContent = ({
	userId,
	enableRemoval,
	setEnableRemoval,
	setRender,
	refetch,
}: {
	userId: string;
	enableRemoval: boolean;
	setEnableRemoval: (value: boolean) => void;
	setRender: (value: boolean) => void;
	refetch: () => Promise<unknown>;
}) => {
	const fullNameRef = useRef<HTMLInputElement>(null);
	const emailRef = useRef<HTMLInputElement>(null);
	const { isLoading, data } = useQuery({
		queryKey: ['getUserDetails', userId],
		queryFn: async () => {
			if (!userId) {
				toast({
					variant: 'destructive',
					title: 'Error!',
					description: 'Something went wrong. Please try again.',
				});
				return null;
			}
			const res = await getSingleUser(userId);
			if (res) return res;
		},
		retry: false,
		initialData: {
			id: userId,
			fullName: fullNameRef.current?.value,
			email: emailRef.current?.value,
		},
	});

	async function handleDeleteUser() {
		const res = await deleteSingleUser(userId);
		if (res) {
			toast({
				variant: 'success',
				title: 'Success!',
				description: 'The user was successfully deleted!',
			});

			setRender(false);
			refetch();
			return;
		}

		toast({
			variant: 'destructive',
			title: 'Error!',
			description: 'Something went wrong. Please try again.',
		});
	}

	async function handleEditUser() {
		const res = await editUser({
			userId: userId,
			fullName: fullNameRef.current!.value,
			email: emailRef.current!.value,
		});

		if (res) {
			toast({
				variant: 'success',
				title: 'Success!',
				description: 'The user was successfully updated!',
			});

			setRender(false);
			refetch();
			return;
		}

		toast({
			variant: 'destructive',
			title: 'Error!',
			description: 'Something went wrong. Please try again.',
		});
	}

	if (!data) return null;
	return (
		<>
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
						defaultValue={data.fullName}
						ref={fullNameRef}
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
						defaultValue={data.email}
						ref={emailRef}
						className='col-span-3'
					/>
				</div>
			</div>
			<DialogFooter className='sm:justify-between'>
				<Button
					variant='destructive'
					disabled={enableRemoval}
					onClick={() => setEnableRemoval(true)}
				>
					{enableRemoval ? 'Will remove user on save ✔' : 'Delete User'}
				</Button>
				<Button
					type='submit'
					onClick={enableRemoval ? handleDeleteUser : handleEditUser}
				>
					{isLoading ? <Loader sm /> : 'Save changes'}
				</Button>
			</DialogFooter>
		</>
	);
};
