'use client';

import { getSession } from '@/src/helpers';
import { useQuery } from '@tanstack/react-query';
import { GptCreator, GptReviewer, NotAllowed } from '../../components';
import { GetGptData } from '../../providers/getGptData';

export default function CreateProfile() {
	// Page component for creating a AI bot profile (GPT builder)
	const { isLoading, error } = useQuery({
		queryKey: ['session'],
		queryFn: getSession,
		retry: false,
	});

	if (error && !isLoading) return <NotAllowed />;
	if (!error && !isLoading)
		return (
			<GetGptData>
				<GptCreator />
				<GptReviewer />
			</GetGptData>
		);
	return null;
}
