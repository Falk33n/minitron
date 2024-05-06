import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { Sidebar } from '../components/sidebar/sidebar';
import { QueryProvider } from '../providers/queryProvider';
import '../styles/globals.scss';

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
			<body className='bg-gradientGray w-full h-screen flex justify-center items-center font-roboto overflow-hidden'>
				<QueryProvider>
					<Sidebar />
					<main className='w-full'>{children}</main>
				</QueryProvider>
			</body>
		</html>
	);
}
