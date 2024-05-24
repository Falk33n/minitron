'use client';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
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
					<ul className='list-disc list-inside my-3.5 ml-5'>{children}</ul>
				),
				li: ({ children }) => (
					<li className='leading-8 my-1.5 only:font-semibold'>{children}</li>
				),
				ol: ({ children }) => <ol className='my-3.5'>{children}</ol>,
				code: ({ node, className, children, ...props }) => {
					const match = /language-(\w+)/.exec(className || '');

					return match ? (
						<>
							<CodeCopyBar
								language={match[1]}
								code={children}
							/>

							<div className='rounded-b-2xl p-4 mb-6 bg-[#1D1F21]'>
								<SyntaxHighlighter
									{...(props as any)}
									language={match[1]}
									style={dark}
								>
									{String(children).replace(/\n$/, '')}
								</SyntaxHighlighter>
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
