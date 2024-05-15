'use client';

import { DataWindow, Loader, NotAllowed } from '@/src/components';
import { getLogs, getSession, getUsers } from '@/src/helpers';
import { LogType } from '@/src/types/adminTypes';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

export default function Admin() {
	const [logHistory, setLogHistory] = useState<LogType>({ Events: [] });
	const [userHistory, setUserHistory] = useState<
		{ id: string; fullName: string; email: string }[]
	>([]);

	const { isLoading: sessionLoading, error: sessionError } = useQuery({
		queryKey: ['session'],
		queryFn: getSession,
		retry: false,
	});

	const authenticated = useMemo(() => {
		if (!sessionError && !sessionLoading) return true;
		return false;
	}, [sessionError, sessionLoading]);

	const { isLoading: usersLoading, refetch } = useQuery({
		queryKey: ['getUsers'],
		queryFn: handleUsers,
		retry: false,
		enabled: authenticated,
	});

	async function handleLogs() {
		setUserHistory([]);
		const response = await getLogs();

		if (response) {
			setLogHistory(response);
		} else {
			throw new Error('Something went wrong');
		}

		return response;
	}

	async function handleUsers() {
		setLogHistory({ Events: [] });
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
			{sessionError && !sessionLoading ? (
				<NotAllowed />
			) : !sessionError && !sessionLoading ? (
				<div className='flex flex-col h-screen py-12 overflow-auto'>
					<div className='w-[85%] h-full m-auto flex flex-col items-center'>
						<section className='size-full m-10 px-10 pt-5 pb-10 rounded-2xl flex flex-col'>
							<DataWindow
								getLogs={handleLogs}
								refetch={refetch}
								userHistory={userHistory}
								logHistory={logHistory}
								loading={usersLoading && <Loader />}
							/>
						</section>
					</div>
				</div>
			) : (
				<></>
			)}
		</>
	);
}
