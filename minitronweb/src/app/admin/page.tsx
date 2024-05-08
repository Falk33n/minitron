'use client';

import { Button, Loader, NotAllowed } from '@/src/components';
import { getSession } from '@/src/helpers';
import { useQuery } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

export default function Admin() {
	const [logHistory, setLogHistory] = useState<string[]>([]);
	const [userHistory, setUserHistory] = useState<string[]>([]);

	const { isLoading, error } = useQuery({
		queryKey: ['sessionAdmin'],
		queryFn: getSession,
		retry: false,
	});

	const handleLogs = () => {
		setLogHistory([]);
	};

	const handleUsers = () => {
		setUserHistory([]);
	};

	return (
		<>
			{isLoading && <Loader />}
			{error && !isLoading ? (
				<NotAllowed message={error.message} />
			) : (
				<div className='flex flex-col h-screen py-12'>
					<div className='w-[85%] h-full m-auto flex flex-col items-center'>
						<section className='size-full bg-black/80 m-10 px-10 pt-5 pb-10 text-white rounded-2xl flex flex-col'>
							<AdminPanel
								logHistory={logHistory}
								userHistory={userHistory}
							>
								<div className='flex gap-4 -mt-2'>
									<form>
										<Button
											className='w-[8rem]'
											onClick={handleLogs}
										>
											Show Logs
										</Button>
									</form>

									<form>
										<Button
											className='w-[8rem]'
											onClick={handleUsers}
										>
											Show Users
										</Button>
									</form>
								</div>
							</AdminPanel>
						</section>
					</div>
				</div>
			)}
		</>
	);
}

const AdminPanel = ({
	children,
	logHistory,
	userHistory,
}: {
	children: ReactNode;
	logHistory: string[];
	userHistory: string[];
}) => {
	return (
		<>
			<div className='flex justify-between px-6'>
				<h2 className='text-xl font-bold mb-4'>Admin Panel</h2>
				{children}
			</div>

			<div className='bg-black/40 rounded-2xl p-8 h-full text-green-400'>
				{logHistory.map((message, index) => (
					<ol
						key={index}
						className=''
					>
						<li>{message}</li>
					</ol>
				))}
				{userHistory.map((message, index) => (
					<ol
						key={index}
						className=''
					>
						<li>{message}</li>
					</ol>
				))}
			</div>
		</>
	);
};
