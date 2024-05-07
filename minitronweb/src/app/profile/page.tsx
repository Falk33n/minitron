'use client';

import { Loader, NotAllowed, PageContainer } from '@/src/components';
import { getSession } from '@/src/helpers';
import { useQuery } from '@tanstack/react-query';

export default function Profile() {
	const { isLoading, error } = useQuery({
		queryKey: ['session'],
		queryFn: getSession,
		retry: false,
	});

	return (
		<>
			{isLoading && <Loader className='' />}
			{error && !isLoading ? (
				<NotAllowed message={error.message} />
			) : (
				<PageContainer
					className='h-[35rem] justify-start p-20'
					heading='Profile'
				>
					<p className='text-lg mt-16 leading-8 text-white px-16 drop-shadow-text'>
						We are currently fixing here take it chill man soon it will come
						very good stuff here
					</p>
				</PageContainer>
			)}
		</>
	);
}
