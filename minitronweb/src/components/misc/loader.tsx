import { Loader2 } from 'lucide-react';

export function Loader({
	className,
	sm,
}: {
	className?: string;
	sm?: boolean;
}) {
	return (
		<div className={className + ' flex'}>
			{!sm && 'Please wait..'}
			<Loader2
				aria-label={sm ? 'Loading please wait...' : ''}
				className='ml-3 text-primary size-5 animate-spin'
			/>
		</div>
	);
}
