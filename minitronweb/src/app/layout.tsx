import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { Toaster } from '../components';
import { Sidebar } from '../components/sidebar/sidebar';
import { QueryProvider } from '../providers/queryProvider';
import '../styles/globals.scss';
import { ClearConvo } from '../providers/clearConvo';
import { Suspensed } from '../providers/suspense';

export const metadata: Metadata = {
	title: 'MinitronAI | Digital assistent',
	description: 'Minitron AI',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
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
