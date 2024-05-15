'use client';

import {
	Button,
	EyeIcon,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
	useToast,
} from '@/src/components';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { FormHTMLAttributes, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { postRegister } from '../../helpers/postAccounts';

export type RegisterFormProps = FormHTMLAttributes<HTMLFormElement> & {
	formHeading: string;
};

const inputStyles =
	'mt-2 font-normal flex h-10 bg-white w-full rounded-md border border-light hover:border-ring focus:outline-primary px-3 py-2 text-sm';

const formSchema = z.object({
	email: z
		.string()
		.trim()
		.regex(/^((?!\.)[\w_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gi, {
			message: "Invalid email format. E.g. format 'test@example.com'",
		}),
	fullName: z.string().trim().min(2, {
		message: 'Full name must be at least 2 letters and cannot contain numbers.',
	}),
	password: z.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{12,}$/, {
		message:
			'A valid password requires at least one uppercase letter, one lowercase letter, and a minimum of 12 characters.',
	}),
});

export function RegisterForm({ ...props }: RegisterFormProps) {
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);
	const { toast } = useToast();

	const { refetch } = useQuery({
		queryKey: ['register'],
		queryFn: () => onSubmit(form.getValues()),
		retry: false,
		enabled: false,
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: '',
			fullName: '',
			password: '',
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const response = await postRegister(values);

		if (response) {
			toast({
				variant: 'success',
				title: 'Success!',
				description: 'You have successfully registered an account.',
			});
		} else {
			toast({
				variant: 'destructive',
				title: 'Error!',
				description: 'Something went wrong. Please try again.',
			});
		}
		return response;
	}

	return (
		<Form {...form}>
			<form
				noValidate
				method='post'
				onSubmit={form.handleSubmit(async () => {
					await refetch();
				})}
				className='w-2/5 h-full bg-white flex flex-col gap-9 rounded-r-2xl py-12 px-16 overflow-y-auto'
			>
				{props.formHeading && (
					<h2 className='font-semibold text-3xl text-center'>
						{props.formHeading}
					</h2>
				)}

				<FormField
					control={form.control}
					name='fullName'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Full Name</FormLabel>

							<FormControl>
								<Input
									type='text'
									className={inputStyles}
									autoComplete='name'
									required
									{...field}
								/>
							</FormControl>

							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='email'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>

							<FormControl>
								<Input
									type='email'
									className={inputStyles}
									autoComplete='email'
									required
									{...field}
								/>
							</FormControl>

							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='password'
					render={({ field }) => (
						<FormItem className={'relative'}>
							<FormLabel>Password</FormLabel>
							<FormControl>
								<>
									<EyeIcon
										isPasswordVisible={isPasswordVisible}
										onClick={() =>
											setIsPasswordVisible(
												(isPasswordVisible) => !isPasswordVisible
											)
										}
										aria-label={
											isPasswordVisible ? 'Hide Password' : 'Show Password'
										}
										title={
											isPasswordVisible ? 'Hide Password' : 'Show Password'
										}
									/>

									<Input
										type={!isPasswordVisible ? 'password' : 'text'}
										className={inputStyles}
										autoComplete={props.autoComplete}
										required
										{...field}
									/>
								</>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button
					className={'mb-4 mt-2'}
					type='submit'
				>
					{props.formHeading}
				</Button>

				{props.children}
			</form>
		</Form>
	);
}
