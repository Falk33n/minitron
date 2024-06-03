'use client';

import { getSession } from '@/src/helpers';
import { useQuery } from '@tanstack/react-query';
import { ChatContainer, NotAllowed } from '../../components';

export default function Chat() {
	// Page component for the AI chatbot
	const { isLoading, error } = useQuery({
		queryKey: ['session'],
		queryFn: getSession,
		retry: false,
	});

	if (error && !isLoading) return <NotAllowed />;
	if (!error && !isLoading) return <ChatContainer />;
	return null;
}
