'use client';

import {
	AnchorListItem,
	Button,
	Loader,
	UnorderedList,
} from '@/src/components';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
	LucideChevronRight,
	LucideMessageSquareText,
	LucideSettings,
} from 'lucide-react';
import Link from 'next/link';
import { HTMLAttributes, forwardRef, useState } from 'react';
import { getSession } from '../../helpers';
import { cn } from '../../utilities/shadUtilities';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export interface SidebarProps extends HTMLAttributes<HTMLElement> {}

export const Sidebar = forwardRef<HTMLElement, SidebarProps>(
	({ className, children, ...props }, ref) => {
		const [isSidebarVisible, setIsSidebarVisible] = useState(false);
		const { isLoading, error } = useQuery({
			queryKey: ['session'],
			queryFn: getSession,
			retry: false,
		});

		return (
			<>
				{isLoading && <Loader sm />}
				{!isLoading && !error && (
					<nav
						className={cn(
							`bg-[#F9F9F9] w-[17rem] h-screen top-0 py-5 px-4 flex flex-col justify-between transition-all duration-300 ${
								isSidebarVisible ? 'relative left-0' : 'absolute -left-[17rem]'
							}`,
							className
						)}
						ref={ref}
						{...props}
					>
						<div>
							<UnorderedList>
								<AnchorListItem href='chat'>
									New Chat <LucideMessageSquareText aria-hidden />
								</AnchorListItem>
							</UnorderedList>
						</div>

						<section className='mt-2 flex flex-col'>
							<h6 className='text-muted-foreground/70 px-2 text-sm'>
								Conversations
							</h6>
						</section>

						<div className='relative flex-1 flex flex-col justify-end'>
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
											<DropdownMenuItem className='cursor-pointer'>
												Logout
											</DropdownMenuItem>
										</button>
									</DropdownMenuContent>
								</DropdownMenu>
							</UnorderedList>
						</div>

						<h6 className='text-xs text-muted-foreground/70 text-center mt-4'>
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
