import { PageContainer } from "../../components";

export default function About() {
	// About us information
	return (
		<PageContainer
			className='h-[35rem] justify-start p-20'
			heading='About Us'
		>
			<p className='text-lg mt-16 leading-8 text-white px-16 drop-shadow-text'>
				We are Minitron, an artificial intelligence project in development,
				fueled by the same fascination with AI&apos;s potential that you likely
				share. Our goal is to become a powerful and accessible language model,
				capable of engaging in informative conversations, adapting to your needs
				for creative writing or comprehensive summaries, and all the while
				pushing the boundaries of AI development. We believe AI can democratize
				information, ignite creativity, and bridge communication gaps. Although
				still under development, we&apos;re eager to learn and grow alongside
				you. Interact with us, ask questions, challenge us with your requests -
				your feedback is the key to shaping our future!
			</p>
		</PageContainer>
	);
}
