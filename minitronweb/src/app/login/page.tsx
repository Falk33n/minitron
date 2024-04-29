import { AnchorLink, SectionWithForm } from '@/src/components';
import { LogInForm } from '@/src/components/loginForm';

export default function LogIn() {
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
