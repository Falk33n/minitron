import { UserType } from '@/src/types/userTypes';
import { ReactNode } from 'react';
import { Button } from '../forms/button';

export const DataWindow = ({
	userHistory,
	loading,
	refetch,
}: {
	userHistory: UserType[];
	loading: ReactNode;
	refetch: () => Promise<unknown>;
}) => {
	return (
		<>
			<div className='flex justify-center fixed top-0 -translate-x-1/2 left-1/2 mt-4'>
				<h2 className='text-xl font-bold'>Admin Panel</h2>
			</div>

			<div className='rounded-2xl p-8 h-full'>
				{!loading && (
					<>
						<div className='flex gap-4 ml-32'>
							<form>
								<Button
									className={`w-[3.5rem] h-[3rem] items-start rounded-b-none`}
									onClick={(e) => {
										e.preventDefault();
										refetch();
									}}
								>
									Users
								</Button>
							</form>

							<form>
								<Button
									className={`w-[3.5rem] h-[3rem] items-start rounded-b-none ${
										userHistory.length > 0
											? 'bg-border text-black hover:bg-border/30'
											: ''
									}`}
									onClick={(e) => {
										e.preventDefault();
									}}
								>
									Logs
								</Button>
							</form>
						</div>

						<table className='w-[90%] mx-auto [&>tr]:flex'>
							{userHistory.length > 0 && (
								<thead>
									<tr className='[&>th]:border [&>th]:px-4 [&>th]:py-2'>
										<th className='flex-[5%] rounded-tl-xl'>No.</th>
										<th className='flex-[35%] text-start'>ID</th>
										<th className='flex-[35%] text-start'>Email</th>
										<th className='flex-[25%] text-start rounded-tr-xl'>
											Full Name
										</th>
									</tr>
								</thead>
							)}

							<tbody>
								{userHistory.map((message, index) => (
									<tr
										className='[&>td]:p-4 [&>td]:border'
										key={index}
									>
										<td className={`flex-[5%] text-center font-bold`}>
											{index}.
										</td>
										<td className='flex-[35%]'>{message.id}</td>
										<td className='flex-[35%]'>{message.email}</td>
										<td
											className={`flex-[25%] ${
												message.fullName === 'string' ? 'bg-black/5' : ''
											}`}
										>
											{message.fullName === 'string' ? '' : message.fullName}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</>
				)}
			</div>
		</>
	);
};
