import { Loader2 } from 'lucide-react';

export function Loader() {
	return (
		<button
			className='fixed top-0 left-0 flex justify-center items-center w-full h-screen bg-black/75 backdrop-blur z-20'
			disabled
		>
			<Loader2 className='text-primary size-20 animate-spin' />
		</button>
	);
}
