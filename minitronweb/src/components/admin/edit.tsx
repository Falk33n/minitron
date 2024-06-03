'use client';

import { deleteSingleUser, editUser, getSingleUser } from '@/src/helpers';
import { useQuery } from '@tanstack/react-query';
import { LucidePencil } from 'lucide-react';
import { useRef, useState } from 'react';
import {
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	Input,
	Label,
	LoadingIcon,
	toast,
} from '../';

export const Edit = ({
	userId,
	refetch,
}: {
	userId: string;
	refetch: () => Promise<unknown>;
}) => {
	const [enableRemoval, setEnbableRemoval] = useState(false);
	const [render, setRender] = useState(true);

	// Component to handle the UI for editing a users information
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

	// Query to access a single user
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

	// Function to handle the removal of a user
	async function handleDeleteUser() {
		const res = await deleteSingleUser(userId);
		if (res) {
			toast({
				variant: 'success',
				title: 'Success!',
				description: 'The user was successfully deleted!',
			});

			setRender(false);
			return refetch();
		}

		toast({
			variant: 'destructive',
			title: 'Error!',
			description: 'Something went wrong. Please try again.',
		});
	}

	// Function to handle the edit of a user
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
			return refetch();
		}

		toast({
			variant: 'destructive',
			title: 'Error!',
			description: 'Something went wrong. Please try again.',
		});
	}

	if (data)
		return (
			<>
				<DialogHeader>
					<DialogTitle>Edit profile</DialogTitle>
					<DialogDescription>
						Make changes to the profile here. Click save when you&apos;re done.
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
						{isLoading ? <LoadingIcon sm /> : 'Save changes'}
					</Button>
				</DialogFooter>
			</>
		);
    
	return null;
};
