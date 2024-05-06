'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

const queryClient = new QueryClient({
	defaultOptions: {
		mutations: {
			onError: (error, variables, context) => {
				console.error(
					'Warning! Global Mutation Error:',
					error.message,
					variables,
					context
				);
			},
		},
	},
});

export function Providers({ children }: { children: ReactNode }) {
	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
}
