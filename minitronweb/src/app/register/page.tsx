import { AnchorLink, RegisterForm, SectionWithForm } from '@/src/components';

export default function Register() {
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

				<nav className='text-xs text-muted-foreground -mt-4 [word-spacing:1px]'>
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
