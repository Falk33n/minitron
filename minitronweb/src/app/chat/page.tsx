'use client';

import { ChatContainer, NotAllowed } from '@/src/components';
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
			{error && !isLoading ? (
				<NotAllowed />
			) : !error && !isLoading ? (
				<ChatContainer />
			) : (
				<></>
			)}
		</>
	);
}
