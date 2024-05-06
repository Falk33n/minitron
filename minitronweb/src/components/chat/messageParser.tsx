import 'highlight.js/styles/tomorrow-night.css';
import Highlight from 'react-highlight';
import Markdown from 'react-markdown';

export const MessageParser = ({ markdown }: { markdown: string }) => {
	return (
		<Markdown
			components={{
				code: ({ node, className, children, ...props }) => {
					const match = /language-(\w+)/.exec(className || '');
					return match ? (
						<div className='rounded-b-2xl p-4 my-6 bg-[#1D1F21]'>
							<Highlight
								{...(props as any)}
								language={match[1]}
							>
								{String(children).replace(/\n$/, '')}
							</Highlight>
						</div>
					) : (
						<code
							className={className}
							{...props}
						>
							{children}
						</code>
					);
				},
			}}
		>
			{markdown}
		</Markdown>
	);
};
