import {
	LucideFileQuestion,
	LucideHome,
	LucidePhoneCall,
	LucideUserCircle,
} from 'lucide-react';
import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { AnchorListItem, UnorderedList } from '../components';
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
			<body className='bg-gradientGray w-full h-screen flex justify-between items-center font-roboto'>
				<nav className='bg-white w-60 h-screen shadow-navbar p-8 flex flex-col justify-between'>
					<div className='relative'>
						<UnorderedList>
							<AnchorListItem href='/'>
								Home <LucideHome />
							</AnchorListItem>
							<AnchorListItem href='/login'>
								Log In <LucideUserCircle />
							</AnchorListItem>
							{/* <AnchorListItem href='/chat'>////////////////// ONLY SHOW WHEN LOGGED IN
							New Chat <LucideFilePen />
						</AnchorListItem> */}
						</UnorderedList>
					</div>

					<div className='relative'>
						<UnorderedList>
							<AnchorListItem href='/about'>
								About Us <LucideFileQuestion />
							</AnchorListItem>
							<AnchorListItem href='/contact'>
								Contact Us <LucidePhoneCall />
							</AnchorListItem>
						</UnorderedList>
					</div>
				</nav>
				{children}
			</body>
		</html>
	);
}
