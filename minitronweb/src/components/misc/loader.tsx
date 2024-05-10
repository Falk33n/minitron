import { Loader2 } from 'lucide-react';

export function Loader({
	className,
	sm,
}: {
	className?: string;
	sm?: boolean;
}) {
	return (
		<button
			className={className + ' flex'}
			disabled
		>
			{!sm && 'Please wait..'}
			<Loader2 className='ml-3 text-primary size-5 animate-spin' />
		</button>
	);
}
