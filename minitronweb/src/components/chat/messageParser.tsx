'use client';

import 'highlight.js/styles/tomorrow-night.css';
import Highlight from 'react-highlight';
import Markdown from 'react-markdown';
import { CodeCopyBar } from './codeCopyBar';

export const MessageParser = ({
	text,
	className,
}: {
	text: string | Response;
	className?: string;
}) => {
	return (
		<Markdown
			className={className}
			components={{
				a: ({ children, href }) => (
					<a
						href={href}
						target='_blank'
						rel='noreferrer'
						className='text-primary underline'
					>
						{children}
					</a>
				),
				ul: ({ children }) => (
					<ul className='list-disc list-inside my-2.5'>{children}</ul>
				),
				ol: ({ children }) => (
					<ol className='list-decimal list-inside my-2.5'>{children}</ol>
				),
				code: ({ node, className, children, ...props }) => {
					const match = /language-(\w+)/.exec(className || '');

					return match ? (
						<>
							<CodeCopyBar
								language={match[1]}
								code={children}
							/>

							<div className='rounded-b-2xl p-4 mb-6 bg-[#1D1F21]'>
								<Highlight
									{...(props as any)}
									language={match[1]}
								>
									{String(children).replace(/\n$/, '')}
								</Highlight>
							</div>
						</>
					) : (
						<code
							className={'font-roboto font-bold'}
							{...props}
						>
							{children}
						</code>
					);
				},
			}}
		>
			{text as string}
		</Markdown>
	);
};
