import {
	LucideFileQuestion,
	LucideHome,
	LucidePhoneCall,
	LucideUserCircle,
} from 'lucide-react';
import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { AnchorListItem } from '../components';
import '../styles/globals.scss';

const listContainerClasses = 'flex flex-col gap-6';

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
			<body className='bg-gradientBlue w-full h-screen flex justify-between items-center font-roboto'>
				<nav className='bg-white w-60 h-screen shadow-navbar p-8 flex flex-col justify-between'>
					<ul className={listContainerClasses}>
						<AnchorListItem href='/'>
							Home <LucideHome />
						</AnchorListItem>
						{/* 						<AnchorListItem href='/chat'> ONLY SHOW WHEN LOGGED IN
							New Chat <LucideFilePen />
						</AnchorListItem> */}
					</ul>
					<ul className={listContainerClasses}>
						<AnchorListItem href='/'>
							Log In <LucideUserCircle />
						</AnchorListItem>
						<AnchorListItem href='/'>
							About Us <LucideFileQuestion />
						</AnchorListItem>
						<AnchorListItem href='/'>
							Contact Us <LucidePhoneCall />
						</AnchorListItem>
					</ul>
				</nav>
				{children}
			</body>
		</html>
	);
}
