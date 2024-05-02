import { Logo } from '../components';

export default function Home() {
	return (
		<section className='bg-gradientBlue w-[75%] flex flex-col items-center justify-center py-32 rounded-2xl shadow-accounts mx-auto'>
			<h1 className='text-[3rem] text-background font-bold text-center drop-shadow-text'>
				Welcome to Minitron!
			</h1>

			<Logo />

			<p className='text-background font-medium opacity-95 text-center drop-shadow-text'>
				Navigate inside the menu to the left to start using your MinitronAI
				assistent for free
			</p>
		</section>
	);
}
