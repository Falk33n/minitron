'use client';

import { getSession } from '@/src/helpers';
import { useQuery } from '@tanstack/react-query';
import { NotAllowed, PageContainer } from '../../components';

export default function Profile() {
	// Page component for the user profile
	const { isLoading, error } = useQuery({
		queryKey: ['session'],
		queryFn: getSession,
		retry: false,
	});

	if (error && !isLoading) return <NotAllowed />;
	if (!error && !isLoading) return <PageContainer />;
	return null;
}
