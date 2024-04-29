import '@fortawesome/fontawesome-svg-core/styles.css';
import type { Metadata } from 'next';
import 'tailwindcss/tailwind.css';
import { Logo } from '../components';
import '../styles/globals.scss';

export const metadata: Metadata = {
	title: 'Minitron',
	description: 'Minitron AI',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body className='h-screen bg-gradientGray'>
				<nav>
					<ul>
            <li></li>
          </ul>
				</nav>
				{children}
			</body>
		</html>
	);
}
