'use client';

import { ReactNode, useState } from 'react';

export function CodeCopyBar({
	language,
	code,
}: {
	language: string;
	code: ReactNode;
}) {
	const [isCopied, setIsCopied] = useState(false);

	const copyCodeToClipboard = () => {
		navigator.clipboard
			.writeText(String(code).replace(/\n$/, ''))
			.then(() => {
				setIsCopied(true);

				setTimeout(() => {
					setIsCopied(false);
				}, 2750);
			})
			.catch((error) =>
				console.error('Failed to copy code to clipboard', error)
			);
	};

	return (
		<div className='bg-[#000000] text-white/60 mt-6 flex justify-between items-center px-4 pb-1.5 pt-2 rounded-t-2xl'>
			<h6 className='hover:text-white/90'>{language}</h6>
			<button
				className='hover:text-white/90'
				onClick={copyCodeToClipboard}
			>
				{isCopied ? '✓ Copied!' : 'Copy Code'}
			</button>
		</div>
	);
}
