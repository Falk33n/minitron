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
						`bg-[#F9F9F9] w-[11%] h-screen top-0 py-5 px-4 flex flex-col justify-between transition-all duration-300 ${
							isSidebarVisible ? 'relative left-0' : 'absolute -left-[13rem]'
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

					<div className='mt-4 flex flex-col'>
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

									<AnchorListItem href='profile'>
										Settings <LucideSettings aria-hidden />
									</AnchorListItem>

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
						className='absolute top-1/2 -translate-y-1/2 -right-10'
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
