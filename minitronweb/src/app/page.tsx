import { AnchorLink, SectionWithForm } from '@/src/components';
import { LogInForm } from '@/src/components/forms/loginForm';

export default function Home() {
	return (
		<SectionWithForm
			sectionHeading='Welcome back to Minitron!'
			sectionDescription='Log in to your account to access Minitron AI'
			isRegisterPage={false}
		>
			<LogInForm formHeading='Log In'>
				<AnchorLink
					paragraph="Don't have an account?"
					link='Register here'
					href='register'
				/>
			</LogInForm>
		</SectionWithForm>
	);
}
