import '@fortawesome/fontawesome-svg-core/styles.css';
import type { Metadata } from 'next';
import 'tailwindcss/tailwind.css';
import { Logo } from '../components';
import '../styles/globals.scss';
import {
	LucideFilePen,
	LucideHome,
	LucideNotebookPen,
	LucidePen,
	LucideUserCircle,
} from 'lucide-react';

export const metadata: Metadata = {
	title: 'MinitronAI | Digital assistent',
	description: 'Minitron AI',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body className='bg-gradientBlue w-full h-screen flex justify-between items-center'>
				<nav className='bg-white w-60 h-screen'>
					<ul>
						<li>
							Home <LucideHome />
						</li>
						<li>
							Log In <LucideUserCircle />
						</li>
						<li>
							New Chat <LucideFilePen />
						</li>
					</ul>
				</nav>
				{children}
			</body>
		</html>
	);
}
