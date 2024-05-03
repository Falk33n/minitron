'use client';

import { useState } from 'react';

export type AgentWrapperProps = {
	name: string;
	description: string;
	className?: string;
};

export const NewChatPopup = () => {
	return (
		<div className='w-full h-screen fixed left-0 top-0 bg-black/75 z-[10]'>
			<section className='p-6 flex flex-col fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradientGray rounded-2xl w-[50%]'>
				<h2 className='text-3xl font-bold text-center mb-3'>
					Choose your agent:
				</h2>

				<div className='flex gap-6'>
					<AgentWrapper
						className='bg-primary/15 w-[12.5rem] p-3 rounded-lg '
						name='Default'
						description='This is the default agent of MinitronAI. It does not set any specific settings to the AI.'
					/>
				</div>
			</section>
		</div>
	);
};

NewChatPopup.displayName = 'NewChatPopup';

const AgentWrapper = ({ name, description, className }: AgentWrapperProps) => {
	const [isAgentSelected, setIsAgentSelected] = useState(false);
	return (
		<section
			className={className}
			onClick={() => setIsAgentSelected((isAgentSelected) => !isAgentSelected)}
		>
			<h4 className='text-lg font-medium mb-1.5'>{name}</h4>
			<p>{description}</p>
		</section>
	);
};

AgentWrapper.displayName = 'AgentWrapper';
