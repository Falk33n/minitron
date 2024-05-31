'use client';

import { GptCreator, GptReviewer, NotAllowed } from '@/src/components';
import { getSession } from '@/src/helpers';
import { useQuery } from '@tanstack/react-query';
import { GetGptData } from '../../providers/getGptData';

export default function CreateProfile() {
	const { isLoading, error } = useQuery({
		queryKey: ['session'],
		queryFn: getSession,
		retry: false,
	});
	//test räva

	return (
		<>
			{error && !isLoading ? (
				<NotAllowed />
			) : !error && !isLoading ? (
				<div className='flex min-h-screen w-full'>
					<GetGptData>
						<GptCreator />
						<GptReviewer />
					</GetGptData>
				</div>
			) : (
				<></>
			)}
		</>
	);
}
