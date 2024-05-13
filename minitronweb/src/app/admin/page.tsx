'use client';

import { DataWindow, Loader, NotAllowed } from '@/src/components';
import { getUsers } from '@/src/helpers';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

export default function Admin() {
	const [logHistory, setLogHistory] = useState<string[]>([]);
	const [userHistory, setUserHistory] = useState<
		{ id: string; fullName: string; email: string }[]
	>([]);

	const { isLoading, error, refetch } = useQuery({
		queryKey: ['getUsers'],
		queryFn: handleUsers,
		retry: false,
	});

	const handleLogs = () => {
		setLogHistory([]);
	};

	async function handleUsers() {
		setLogHistory([]);
		const response = await getUsers();

		if (response) {
			setUserHistory(response);
		} else {
			throw new Error('Something went wrong');
		}

		return response;
	}

	return (
		<>
			{error && !isLoading ? (
				<NotAllowed message={error.message} />
			) : (
				<div className='flex flex-col h-screen py-12 overflow-auto'>
					<div className='w-[85%] h-full m-auto flex flex-col items-center'>
						<section className='size-full m-10 px-10 pt-5 pb-10 rounded-2xl flex flex-col'>
							<DataWindow
								refetch={refetch}
								userHistory={userHistory}
								loading={isLoading && <Loader />}
							/>
						</section>
					</div>
				</div>
			)}
		</>
	);
}
