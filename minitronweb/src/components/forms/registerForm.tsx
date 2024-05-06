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
} from '@/src/components';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormHTMLAttributes, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { postRegister } from '../../helpers/accounts';

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

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: '',
			fullName: '',
			password: '',
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			const response = await postRegister(values);
			console.log('Registration successful:', response);
		} catch (error) {
			console.error('Registration failed:', error);
		}
	}

	return (
		<Form {...form}>
			<form
				noValidate
				method='post'
				onSubmit={form.handleSubmit(onSubmit)}
				className='w-2/5 h-full bg-white flex flex-col gap-7 rounded-r-2xl py-12 px-16'
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
						<FormItem
							className={`${
								form.formState.submitCount > 0 && !form.formState.isValid
									? '-mt-3'
									: ''
							}`}
						>
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
						<FormItem
							className={`${
								form.formState.submitCount > 0 && !form.formState.isValid
									? '-mt-5'
									: ''
							}`}
						>
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
						<FormItem
							className={`${'relative'} ${
								form.formState.submitCount > 0 && !form.formState.isValid
									? '-mt-5'
									: ''
							}`}
						>
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
					className={`${'mb-4 mt-2'} ${
						form.formState.submitCount > 0 && !form.formState.isValid
							? '-mt-3 mb-0.5'
							: ''
					}`}
					type='submit'
				>
					{props.formHeading}
				</Button>

				{props.children}
			</form>
		</Form>
	);
}
