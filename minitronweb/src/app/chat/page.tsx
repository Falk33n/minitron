'use client';

import { ChatContainer, Loader, NotAllowed } from '@/src/components';
import { getSession } from '@/src/helpers';
import { useQuery } from '@tanstack/react-query';

export default function Chat() {
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
				<ChatContainer />
			)}
		</>
	);
}
