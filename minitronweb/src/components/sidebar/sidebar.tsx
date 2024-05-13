'use client';

import {
	AnchorListItem,
	Button,
	Loader,
	UnorderedList,
} from '@/src/components';
import { useQuery } from '@tanstack/react-query';
import {
	LucideBadgeInfo,
	LucideChevronRight,
	LucideMessageSquareText,
	LucidePhoneForwarded,
	LucideSettings,
} from 'lucide-react';
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
							{isLoading && (
								<AnchorListItem href='#'>
									<Loader className='' />
								</AnchorListItem>
							)}
							{!isLoading && !error && (
								<AnchorListItem href='chat'>
									New Chat <LucideMessageSquareText aria-hidden />
								</AnchorListItem>
							)}
						</UnorderedList>
					</div>

					<div className='mt-2 flex flex-col'>
						<h6 className='text-muted-foreground/70 px-2 text-sm'>
							Conversations
						</h6>
					</div>

					{/* HISTORY HERE
      <div>
        <UnorderedList>
          <AnchorListItem href=''></AnchorListItem>
        </UnorderedList>
        <UnorderedList>
          <AnchorListItem href=''></AnchorListItem>
        </UnorderedList>
        <UnorderedList>
          <AnchorListItem href=''></AnchorListItem>
        </UnorderedList>
      </div> */}

					<div className='relative flex-1 flex flex-col justify-end'>
						<UnorderedList>
							<AnchorListItem href='about'>
								About <LucideBadgeInfo aria-hidden />
							</AnchorListItem>

							<AnchorListItem href='contact'>
								Contact <LucidePhoneForwarded aria-hidden />
							</AnchorListItem>

							{/* 						{getSession().then(
            (authenticated) =>
              authenticated && (
                <>
                  <AnchorListItem href='createprofile'>
                    Add Agent <LucideBadgePlus aria-hidden />
                  </AnchorListItem>
                  <AnchorListItem href='profile'>
                    Settings <LucideSettings aria-hidden />
                  </AnchorListItem>
                  <AnchorListItem href='logout'>
                    Logout <LucideLogOut aria-hidden />
                  </AnchorListItem>
                </>
              )
          )} */}

							{isLoading && (
								<AnchorListItem href='#'>
									<Loader className='' />
								</AnchorListItem>
							)}
							{!isLoading && !error && (
								<>
									{/* 			<AnchorListItem href='createprofile'>
										Add Agent <LucideBadgePlus aria-hidden />
									</AnchorListItem> */}

									<DropdownMenu>
										<DropdownMenuTrigger className='rounded-lg flex justify-between font-medium p-2 hover:bg-navbarList/80'>
											Settings
											<LucideSettings
												className='text-primary size-5'
												aria-hidden
											/>
										</DropdownMenuTrigger>
										<DropdownMenuContent>
											<DropdownMenuLabel>My Account</DropdownMenuLabel>
											<DropdownMenuSeparator />
											<DropdownMenuItem>Profile</DropdownMenuItem>
											<DropdownMenuItem>Billing</DropdownMenuItem>
											<DropdownMenuItem>Team</DropdownMenuItem>
											<DropdownMenuItem>Subscription</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>

									{/* 			<AnchorListItem href='logout'>
										Logout <LucideLogOut aria-hidden />
									</AnchorListItem> */}
								</>
							)}
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
			</>
		);
	}
);

Sidebar.displayName = 'Sidebar';
