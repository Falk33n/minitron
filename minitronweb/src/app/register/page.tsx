import { AnchorLink, RegisterForm, SectionWithForm } from '../../components';

export default function Register() {
	// Page component for the register account page
	return (
		<SectionWithForm
			isRegisterPage={true}
			sectionHeading='Welcome to Minitron!'
			sectionDescription='Register a new account to access Minitron AI'
		>
			<RegisterForm formHeading='Register'>
				<nav className='-mt-3'>
					<AnchorLink
						paragraph='Already have an account?'
						link='Log in here'
						href=''
					/>
				</nav>

				<nav className='text-muted-foreground -mt-4 [word-spacing:1px]'>
					<AnchorLink
						paragraph='By registering an account, you agree to our '
						link='Terms of Service'
						href='terms'
					/>

					<AnchorLink
						paragraph=' and '
						link='Privacy Policy'
						href='privacy'
					/>
				</nav>
			</RegisterForm>
		</SectionWithForm>
	);
}
