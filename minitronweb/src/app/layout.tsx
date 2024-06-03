import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { Sidebar, Toaster } from '../components';
import { ClearConvo } from '../providers/clearConvo';
import { QueryProvider } from '../providers/queryProvider';
import { Suspensed } from '../providers/suspense';
import '../styles/globals.scss';

export const metadata: Metadata = {
	title: 'MinitronAI | Digital assistent',
	description: 'Minitron AI',
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang='en'>
			<body className='bg-white w-full h-screen flex justify-center items-center font-roboto overflow-hidden'>
				<Suspensed>
					<QueryProvider>
						<ClearConvo>
							<Toaster />
							<Sidebar />
							<main className='w-full'>{children}</main>
						</ClearConvo>
					</QueryProvider>
				</Suspensed>
			</body>
		</html>
	);
}
