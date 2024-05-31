import { LucideBot } from 'lucide-react';
import { Fragment, ReactNode } from 'react';
import { Loader } from '../misc/loader';
import { RobotChatBubble } from './robotChatBubble';
import { UserChatBubble } from './userChatBubble';

export function ChatRender({
	chatHistory,
	isPending,
	configVisible,
	testAi,
	gptCreationAi,
	children,
}: {
	chatHistory: string[];
	isPending: boolean;
	configVisible?: boolean;
	testAi?: boolean;
	gptCreationAi?: boolean;
	children?: ReactNode;
}) {
	return (
		<div
			className={`flex-1 flex flex-col gap-10 pb-20 w-[79%] px-8 ${
				configVisible && configVisible
					? 'absolute top-[200rem] sr-only'
					: 'my-12'
			}`}
		>
			{chatHistory.map((message, index) => (
				<Fragment key={index}>
					{index !== 0 && gptCreationAi && !testAi && (
						<section
							className={`py-4 px-6 rounded-2xl w-[90%] text-foreground relative break-words leading-7 ${
								testAi && testAi ? 'bg-[#F7F8F9]' : 'bg-white'
							}`}
						>
							{index % 2 !== 0 ? (
								<RobotChatBubble message={message} />
							) : (
								<UserChatBubble message={message} />
							)}
						</section>
					)}

					{!gptCreationAi && !testAi && (
						<section
							className={`py-4 px-6 rounded-2xl w-[90%] text-foreground relative break-words leading-7 ${
								testAi && testAi ? 'bg-[#F7F8F9]' : 'bg-white'
							}`}
						>
							{index % 2 === 0 ? (
								<UserChatBubble message={message} />
							) : (
								<RobotChatBubble message={message} />
							)}
						</section>
					)}

					{testAi && (
						<section
							className={`py-4 px-6 rounded-2xl w-[90%] text-foreground relative break-words leading-7 ${
								testAi && testAi ? 'bg-[#F7F8F9]' : 'bg-white'
							}`}
						>
							{index !== 0 && (
								<>
									{index % 2 !== 0 ? (
										<RobotChatBubble message={message} />
									) : (
										<UserChatBubble
											message={message}
											testAi={testAi}
										/>
									)}
								</>
							)}
						</section>
					)}
				</Fragment>
			))}

			{children}
			{isPending && (
				<div className='ml-6 mt-2'>
					<section className='text-black font-bold flex gap-2 mb-1 text-sm -ml-7'>
						<LucideBot className='size-[1.15rem] -mt-[2px] text-primary' />
						<h4>MinitronAI</h4>
					</section>
					<Loader />
				</div>
			)}
		</div>
	);
}
