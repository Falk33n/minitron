import { AnchorLink, LogInForm, SectionWithForm } from '../components';

export default function Home() {
	// Page component for the login page
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
