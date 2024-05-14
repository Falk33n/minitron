import { LogType, UserType } from '@/src/types/adminTypes';
import { ReactNode } from 'react';
import { Button } from '../forms/button';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '../ui/accordion';

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
										Object.keys(logHistory).length > 0
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
											{index}.
										</td>
										<td className='flex-[35%]'>{message.id}</td>
										<td className='flex-[35%]'>{message.email}</td>
										<td
											className={`flex-[25%] ${
												message.fullName === 'string' ? 'bg-black/5' : ''
											}`}
										>
											{message.fullName}
										</td>
									</tr>
								))}
							</tbody>
						</table>

						{Object.keys(logHistory).length > 0 && (
							<Accordion
								className='w-[90%] mx-auto'
								type='multiple'
							>
								<AccordionItem value={`item-${Object.keys(logHistory).length}`}>
									<AccordionTrigger className='font-bold'>
										Properties
									</AccordionTrigger>
									{logHistory.Events?.map((event, parentI) => (
										<AccordionContent key={parentI}>
											<table
												className='w-full mb-10'
												key={parentI}
											>
												<thead>
													<tr className='[&>th]:border [&>th]:px-4 [&>th]:py-2 flex'>
														<th className='flex-[6%]'>Log {parentI + 1}</th>
														<th className='flex-[16%] text-start'>Name</th>
														<th className='flex-[37%] text-start'>Value</th>
														<th className='flex-[7%]'>Value ID</th>
														<th className='flex-[34%] text-start'>
															Value Name
														</th>
													</tr>
												</thead>
												<tbody>
													{event.Properties?.map((prop, i) => (
														<tr
															key={i}
															className='[&>td]:border [&>td]:p-4 flex [&>td]:text-ellipsis [&>td]:overflow-hidden'
														>
															<td className='flex-[6%] text-center font-bold'>
																{i + 1}.
															</td>
															<td className='flex-[16%]'>{prop.Name}</td>
															<td
																className={`flex-[37%] ${
																	(prop.Value &&
																		typeof prop.Value === 'object') ||
																	!prop.Value
																		? 'bg-black/5'
																		: ''
																}`}
															>
																{prop.Value && typeof prop.Value !== 'object'
																	? prop.Value
																	: undefined}
															</td>
															<td
																className={`text-center flex-[7%] ${
																	prop.Value && typeof prop.Value === 'object'
																		? prop.Value.Id
																			? ''
																			: 'bg-black/5'
																		: 'bg-black/5'
																}`}
															>
																{prop.Value && typeof prop.Value === 'object'
																	? prop.Value.Id
																	: undefined}
															</td>
															<td
																className={`flex-[34%] ${
																	prop.Value && typeof prop.Value === 'object'
																		? prop.Value.Name
																			? ''
																			: 'bg-black/5'
																		: 'bg-black/5'
																}`}
															>
																{prop.Value && typeof prop.Value === 'object'
																	? prop.Value.Name
																	: undefined}
															</td>
														</tr>
													))}
												</tbody>
											</table>
										</AccordionContent>
									))}
								</AccordionItem>
							</Accordion>
						)}
					</>
				)}
			</div>
		</>
	);
};
