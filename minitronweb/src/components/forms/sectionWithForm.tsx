import { FormHTMLAttributes, HTMLAttributes } from 'react';
import { Logo } from '../misc/logo';

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
			className={`w-[80%] flex items-center h-[40rem] shadow-accounts rounded-2xl mx-auto ${
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

				<Logo />

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
