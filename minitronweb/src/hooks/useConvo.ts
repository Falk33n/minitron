import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

export const useConvo = () => {
	const router = useRouter();
	const search = useSearchParams();
	const convoId = useMemo(() => {
		return search.get('conversationId');
	}, [search]);

	function updateConvoId(location: string, id: number) {
		router.push(`/${location}?conversationId=${id}`);
	}

	return [convoId, updateConvoId] as const;
};
