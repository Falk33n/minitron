import { FormHTMLAttributes, HTMLAttributes } from 'react';
import { Logo } from './logo';

export type SectionWithFormProps = FormHTMLAttributes<HTMLFormElement> &
	HTMLAttributes<HTMLElement> & {
		sectionHeading: string;
		sectionDescription: string;
		isRegisterPage: boolean;
	};

export const SectionWithForm = ({
	sectionHeading,
	sectionDescription,
	isRegisterPage,
	children,
}: SectionWithFormProps) => {
	return (
		<div
			className={`font-roboto box-border w-4/5 flex items-center h-[40rem] shadow-accounts rounded-2xl fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 ${
				!isRegisterPage ? 'flex-row-reverse' : ''
			}`}
		>
			<section
				className={`w-3/5 h-full p-16 flex flex-col justify-center items-center ${
					!isRegisterPage
						? 'rounded-r-2xl bg-reversed-gradientBlue'
						: 'rounded-l-2xl bg-gradientBlue'
				}`}
			>
				{sectionHeading && (
					<h1 className='text-[2.5rem] text-background font-bold text-center drop-shadow-text'>
						{sectionHeading}
					</h1>
				)}

				<Logo className='size-36 rounded-full drop-shadow-logo my-20 drag-none' />

				{sectionDescription && (
					<p className='text-background font-medium opacity-95 text-center drop-shadow-text'>
						{sectionDescription}
					</p>
				)}
			</section>

			{children}
		</div>
	);
};
