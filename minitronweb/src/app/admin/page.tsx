'use client';

import { Button, Loader, NotAllowed } from '@/src/components';
import { getSession } from '@/src/helpers';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

export default function Admin() {
	const [logHistory, setLogHistory] = useState<string[]>([]);
	const [userHistory, setUserHistory] = useState<string[]>([]);

	const { isLoading, error } = useQuery({
		queryKey: ['sessionAdmin'],
		queryFn: getSession,
		retry: false,
	});

	return (
		<>
			{isLoading && <Loader />}
			{error && !isLoading ? (
				<NotAllowed message={error.message} />
			) : (
				<section className='w-[85%] h-screen m-auto flex py-24 flex-col items-center'>
					<h1 className='text-3xl font-bold'>Admin</h1>
					<div className='bg-gray-200 rounded-2xl size-full flex'>
						<div className='w-[20%] flex flex-col justify-center gap-10 p-10 bg-gray-300/5'>
							<form>
								<Button className='w-full'>Show Logs</Button>
							</form>
							<form>
								<Button className='w-full'>Show Users</Button>
							</form>
						</div>
						<section className='w-[80%] bg-black/80 m-10 p-10 text-white rounded-2xl flex flex-col'>
							<h2 className='text-xl font-bold mb-4'>Admin Panel</h2>
							<div className='bg-black/40 rounded-2xl p-8 h-full'>
								{logHistory.map((message, index) => (
									<p
										key={index}
										className=''
									>
										{message}
									</p>
								))}
							</div>
						</section>
					</div>
				</section>
			)}
		</>
	);
}
