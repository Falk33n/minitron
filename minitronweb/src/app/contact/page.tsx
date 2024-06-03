import Link from 'next/link';
import { PageContainer } from '../../components';

export default function Contact() {
	// Page for contact information
	return (
		<PageContainer
			className='h-[40rem] justify-start p-20'
			heading='About Us'
		>
			<p className='text-lg mt-16 leading-8 text-background px-16 drop-shadow-text'>
				We&apos;re always eager to connect! Whether you have a question brewing
				about the world&apos;s wonders, feedback to help us grow, or simply a
				desire to chat and explore the potential of AI, we&apos;re here to
				listen. Feel free to type your inquiry directly in the text box below -
				we&apos;ll make every effort to understand and offer a thoughtful
				response. Did you encounter a technical hiccup? Perhaps you have an idea
				to make our AI even smarter! We value all forms of feedback, as it paves
				the way for our continuous development. So don&apos;t hesitate to share
				your thoughts about MinitronAI - your opinion is crucial in shaping our
				future. We look forward to getting to know you better!
			</p>
			<ul className='px-16 mt-10 mr-auto text-background drop-shadow-text flex flex-col gap-1.5'>
				<li>
					<span className='font-bold'>Phone Number: </span>
					<Link
						href='tel:+69666666666'
						className='hover:underline focus-visible:underline'
					>
						+69 (666) 666-6666
					</Link>
				</li>
				<li>
					<span className='font-bold'>Email: </span>
					<Link
						href='mailto:yolo@swag.com'
						className='hover:underline focus-visible:underline'
					>
						yolo@swag.com
					</Link>
				</li>
			</ul>
		</PageContainer>
	);
}
