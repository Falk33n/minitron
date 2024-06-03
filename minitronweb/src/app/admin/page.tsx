'use client';

import { LogType } from '@/src/types/adminTypes';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { DataWindow, LoadingIcon, NotAllowed } from '../../components';
import { getLogs, getSession, getUsers } from '../../helpers';

export default function Admin() {
	const [logHistory, setLogHistory] = useState<LogType>({ Events: [] });
	const [userHistory, setUserHistory] = useState<
		{ id: string; fullName: string; email: string }[]
	>([]);

	// Query to get session
	const { isLoading: sessionIsLoading, error: sessionError } = useQuery({
		queryKey: ['session'],
		queryFn: getSession,
		retry: false,
	});

	// Memo to check if session is authenticated
	const authenticated = useMemo(() => {
		if (!sessionError && !sessionIsLoading) return true;
		return false;
	}, [sessionError, sessionIsLoading]);

	// Query to fetch users
	const { isLoading: usersIsLoading, refetch } = useQuery({
		queryKey: ['getUsers'],
		queryFn: handleUserData,
		retry: false,
		enabled: authenticated,
	});

	// Query to fetch logs
	async function handleLogData() {
		setUserHistory([]);
		const response = await getLogs();

		if (response) setLogHistory(response);
		else throw new Error('Something went wrong');

		return response;
	}

	async function handleUserData() {
		setLogHistory({ Events: [] });
		const response = await getUsers();

		if (response) setUserHistory(response);
		else throw new Error('Something went wrong');

		return response;
	}

	if (sessionError && !sessionIsLoading) return <NotAllowed />;
	if (authenticated)
		return () => {
			<div className='flex flex-col h-screen py-12 overflow-auto'>
				<div className='w-[85%] h-full m-auto flex flex-col items-center'>
					<section className='size-full m-10 px-10 pt-5 pb-10 rounded-2xl flex flex-col'>
						<DataWindow
							getLogs={handleLogData}
							refetch={refetch}
							userHistory={userHistory}
							logHistory={logHistory}
							loading={usersIsLoading && <LoadingIcon />}
						/>
					</section>
				</div>
			</div>;
		};
	return null;
}
