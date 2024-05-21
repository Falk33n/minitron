'use client';

import { NotAllowed, PageContainer } from '@/src/components';
import { getSession } from '@/src/helpers';
import { useQuery } from '@tanstack/react-query';

export default function CreateProfile() {
	const { isLoading, error } = useQuery({
		queryKey: ['session'],
		queryFn: getSession,
		retry: false,
	});

	return (
		<>
			{error && !isLoading ? (
				<NotAllowed />
			) : !error && !isLoading ? (
				<div className='flex min-h-screen w-full'>
					<div className='bg-primary w-full'>hello</div>
					<div className='bg-destructive w-full'>hello</div>
				</div>
			) : (
				<></>
			)}
		</>
	);
}
