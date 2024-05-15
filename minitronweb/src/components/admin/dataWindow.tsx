import { LogType, UserType } from '@/src/types/adminTypes';
import { ReactNode } from 'react';
import { Button } from '../forms/button';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '../ui/accordion';
import { Edit } from './edit';

export const DataWindow = ({
	userHistory,
	logHistory,
	loading,
	refetch,
	getLogs,
}: {
	logHistory: LogType;
	userHistory: UserType[];
	loading: ReactNode;
	refetch: () => Promise<unknown>;
	getLogs: () => Promise<unknown>;
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
									className={`w-[3.5rem] h-[3rem] items-start rounded-b-none ${
										Object.keys(logHistory).length > 1
											? 'bg-border text-black hover:bg-border/30'
											: ''
									}`}
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
										getLogs();
									}}
								>
									Logs
								</Button>
							</form>
						</div>

						<table className='w-[90%] mx-auto'>
							<thead>
								{userHistory.length > 0 && (
									<tr className='[&>th]:border [&>th]:px-4 [&>th]:py-2 flex'>
										<th className='flex-[5%] rounded-tl-xl'>No.</th>
										<th className='flex-[35%] text-start'>ID</th>
										<th className='flex-[35%] text-start'>Email</th>
										<th className='flex-[25%] text-start rounded-tr-xl'>
											Full Name
										</th>
									</tr>
								)}
							</thead>

							<tbody>
								{userHistory.map((message, index) => (
									<tr
										className='[&>td]:p-4 [&>td]:border flex [&>td]:text-ellipsis [&>td]:overflow-hidden'
										key={index}
									>
										<td className={`flex-[5%] text-center font-bold`}>
											{index + 1}
										</td>
										<td className='flex-[35%]'>{message.id}</td>
										<td className='flex-[35%]'>{message.email}</td>
										<td
											className={`flex-[25%] flex justify-between ${
												message.fullName === 'string' ? 'bg-black/5' : ''
											}`}
										>
											{message.fullName}
											<Edit />
										</td>
									</tr>
								))}
							</tbody>
						</table>

						{Object.keys(logHistory).length > 1 && (
							<Accordion
								className='w-[90%] mx-auto border-t last:mb-20'
								type='multiple'
							>
								{logHistory.Events?.map((event, parentI) => (
									<AccordionItem
										key={parentI}
										value={`item-${parentI + 1}`}
									>
										<AccordionTrigger className='font-bold px-4'>
											Log {parentI + 1}
										</AccordionTrigger>
										<AccordionContent>
											<table
												className='w-full mb-10'
												key={parentI}
											>
												<thead>
													<tr className='[&>th]:border [&>th]:px-4 [&>th]:py-2 flex'>
														<th className='flex-[15%] text-start'>Field</th>
														<th className='flex-[85%] text-start'>Value</th>
													</tr>
												</thead>
												<tbody>
													{Object.entries(event).map(([key, value], i) => (
														<tr
															key={i}
															className='[&>td]:border [&>td]:p-4 flex [&>td]:text-ellipsis [&>td]:overflow-hidden'
														>
															<td className='flex-[15%] font-bold'>{key}</td>
															<td className='flex-[85%]'>
																{typeof value === 'object' && value !== null ? (
																	<p className='whitespace-pre'>
																		{JSON.stringify(value, null, 4)
																			.replace(/{/g, '')
																			.replace(/\[/g, '')
																			.replace(/]/g, '')
																			.replace(/,/g, '')
																			.replace(/}/g, '')
																			.replace(/"/g, '')}
																	</p>
																) : (
																	value
																)}
															</td>
														</tr>
													))}
												</tbody>
											</table>
										</AccordionContent>
									</AccordionItem>
								))}
							</Accordion>
						)}
					</>
				)}
			</div>
		</>
	);
};
