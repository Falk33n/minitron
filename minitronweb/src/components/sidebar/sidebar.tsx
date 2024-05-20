'use client';

import {
	AnchorListItem,
	Button,
	Loader,
	UnorderedList,
	toast,
} from '@/src/components';
import { useQuery } from '@tanstack/react-query';
import {
	LucideChevronRight,
	LucideMessageSquareText,
	LucideSettings,
} from 'lucide-react';
import Link from 'next/link';
import {
	HTMLAttributes,
	forwardRef,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react';
import { getSession, postLogout } from '../../helpers';
import { cn } from '../../utilities/shadUtilities';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { ClearConvoCtx } from '@/src/providers/clearConvo';
import { useRouter } from 'next/navigation';
import { getAllConvos, summarizeConvo } from '@/src/helpers/convos';
import { useConvo } from '@/src/hooks/useConvo';

export interface SidebarProps extends HTMLAttributes<HTMLElement> {}

export const Sidebar = forwardRef<HTMLElement, SidebarProps>(
	({ className, children, ...props }, ref) => {
		const [isSidebarVisible, setIsSidebarVisible] = useState(false);
		const [convoId] = useConvo();
		const {
			setForceClear,
			chatSummarize,
			setChatSummarize,
			idHistory,
			setIdHistory,
			setNewChat,
		} = useContext(ClearConvoCtx);
		const router = useRouter();

		const {
			isLoading: sessionLoading,
			error: sessionError,
			refetch: sessionRefetch,
		} = useQuery({
			queryKey: ['session'],
			queryFn: getSession,
			retry: false,
		});

		const authenticated = useMemo(() => {
			if (!sessionError && !sessionLoading) return true;
			return false;
		}, [sessionError, sessionLoading]);

		const { refetch: getAllConvoRefetch } = useQuery({
			queryKey: ['getAllConvo'],
			queryFn: async () => {
				const getAll = await getAllConvos();
				const summarize = summarizeConvo(getAll);
				const ids = summarize.ids;
				const convos = summarize.convos;
				setChatSummarize(convos);
				setIdHistory(ids);
				return true;
			},
			retry: false,
			enabled: authenticated,
		});

		useEffect(() => {
			if (!convoId) return;
			getAllConvoRefetch();
		}, [convoId]);

		return (
			<>
				{sessionLoading && <Loader sm />}
				{!sessionLoading && !sessionError && (
					<nav
						className={cn(
							`bg-[#F9F9F9] w-[17rem] h-screen top-0 py-5 pl-4 flex flex-col justify-between transition-all duration-300 ${
								isSidebarVisible ? 'relative left-0' : 'absolute -left-[17rem]'
							}`,
							className
						)}
						ref={ref}
						{...props}
					>
						<div className='pr-4'>
							<UnorderedList>
								<AnchorListItem
									href='chat'
									onClick={() => {
										setNewChat(true);
										setForceClear(true);
									}}
								>
									New Chat <LucideMessageSquareText aria-hidden />
								</AnchorListItem>
							</UnorderedList>
						</div>

						<section className='my-2 flex flex-col overflow-y-auto mr-1.5 pr-2.5'>
							<h6 className='text-muted-foreground/70 px-2 text-[0.85rem] mb-2'>
								Recent Conversations
							</h6>
							<UnorderedList>
								{chatSummarize.map((summarize, i) => (
									<AnchorListItem
										href={`chat?conversationId=${idHistory[i]}`}
										key={i}
										className='font-normal text-sm text-ellipsis whitespace-nowrap overflow-hidden block opacity-80 hover:opacity-100 focus-visible:opacity-100'
										onClick={() => {
											setNewChat(false);
											setForceClear(true);
										}}
									>
										{summarize}
									</AnchorListItem>
								))}
							</UnorderedList>
						</section>

						<div className='relative flex-1 flex flex-col justify-end pr-4'>
							<UnorderedList>
								<DropdownMenu>
									<DropdownMenuTrigger className='rounded-lg flex justify-between font-medium p-2 hover:bg-navbarList/80'>
										Settings
										<LucideSettings
											className='text-primary size-5'
											aria-hidden
										/>
									</DropdownMenuTrigger>
									<DropdownMenuContent className='w-[12rem]'>
										<DropdownMenuLabel>MinitronAI</DropdownMenuLabel>
										<DropdownMenuSeparator />

										<DropdownMenuItem className='cursor-pointer hover:bg-navbarList/50 focus-visible:bg-navbarList/50 hover:font-medium focus-visible:font-medium'>
											<Link href='/about'>About</Link>
										</DropdownMenuItem>
										<Link href='/contact'>
											<DropdownMenuItem className='cursor-pointer hover:bg-navbarList/50 focus-visible:bg-navbarList/50 hover:font-medium focus-visible:font-medium'>
												Contact
											</DropdownMenuItem>
										</Link>

										<DropdownMenuSeparator />
										<DropdownMenuLabel>My Account</DropdownMenuLabel>
										<DropdownMenuSeparator />

										<Link href='/profile'>
											<DropdownMenuItem className='cursor-pointer hover:bg-navbarList/50 focus-visible:bg-navbarList/50 hover:font-medium focus-visible:font-medium'>
												Profile
											</DropdownMenuItem>
										</Link>

										<Link href='/createprofile'>
											<DropdownMenuItem className='cursor-pointer hover:bg-navbarList/50 focus-visible:bg-navbarList/50 hover:font-medium focus-visible:font-medium'>
												Add Agents
											</DropdownMenuItem>
										</Link>

										<button className='w-full rounded-lg cursor-pointer hover:bg-navbarList/50 focus-visible:bg-navbarList/50 hover:font-medium focus-visible:font-medium'>
											<DropdownMenuItem
												className='cursor-pointer'
												onClick={async () => {
													const res = await postLogout();
													if (!res) {
														toast({
															variant: 'destructive',
															title: 'Error!',
															description:
																'Something went wrong. Please try again.',
														});
														return;
													}

													toast({
														variant: 'success',
														title: 'Success!',
														description: 'You have successfully logged out.',
													});
													router.push('/');
													sessionRefetch();
												}}
											>
												Logout
											</DropdownMenuItem>
										</button>
									</DropdownMenuContent>
								</DropdownMenu>
							</UnorderedList>
						</div>

						<h6 className='text-xs text-muted-foreground/70 text-center mt-4 pr-4'>
							Copyright © 2024 Minitron. All rights reserved
						</h6>

						<Button
							className={`
							transition-all duration-300 absolute top-1/2 -translate-y-1/2 -right-10
							`}
							variant='icon'
							size='icon'
							title={isSidebarVisible ? 'Close Sidebar' : 'Open Sidebar'}
							aria-label={isSidebarVisible ? 'Close Sidebar' : 'Open Sidebar'}
							onClick={() =>
								setIsSidebarVisible((isSidebarVisible) => !isSidebarVisible)
							}
						>
							<LucideChevronRight
								className={`text-muted-foreground size-7 ${
									isSidebarVisible ? 'rotate-180' : 'rotate-0'
								}`}
							/>
						</Button>
					</nav>
				)}
			</>
		);
	}
);

Sidebar.displayName = 'Sidebar';
