import { Loader2 } from 'lucide-react';

export function Loader({ className }: { className?: string }) {
	return (
		<button
			className={className + ' flex'}
			disabled
		>
			Please wait..
			<Loader2 className='ml-3 text-primary size-5 animate-spin' />
		</button>
	);
}
