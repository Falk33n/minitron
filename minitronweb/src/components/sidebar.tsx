'use client';

import {
	AnchorListItem,
	Button,
	NewChatPopup,
	UnorderedList,
} from '@/src/components';
import {
	LucideBadgeInfo,
	LucideChevronRight,
	LucideHome,
	LucideLogOut,
	LucidePhoneForwarded,
	LucidePlusSquare,
	LucideSettings,
} from 'lucide-react';
import { HTMLAttributes, forwardRef, useState } from 'react';
import { cn } from '../utilities/shadUtilities';

export interface SidebarProps extends HTMLAttributes<HTMLElement> {}

export const Sidebar = forwardRef<HTMLElement, SidebarProps>(
	({ className, children, ...props }, ref) => {
		const [isSidebarVisible, setIsSidebarVisible] = useState(false);
		const [isNewChatWindowVisible, setIsNewChatWindowVisible] = useState(false);

		return (
			<nav
				className={cn(
					`bg-white w-60 h-screen top-0 py-8 px-6 flex flex-col justify-between border-r border-r-light transition-all duration-300 ${
						!isSidebarVisible
							? 'relative left-0 shadow-navbar'
							: 'absolute -left-[15rem] shadow-navbar-hidden'
					}`,
					className
				)}
				ref={ref}
				{...props}
			>
				{isNewChatWindowVisible && <NewChatPopup />}

				<div className='relative mt-6'>
					<UnorderedList>
						<AnchorListItem href=''>
							Home <LucideHome aria-hidden />
						</AnchorListItem>

						<AnchorListItem
							href='chat'
							onClick={(event) => {
								event.preventDefault();
								setIsNewChatWindowVisible(
									(isNewChatWindowVisible) => !isNewChatWindowVisible
								);
							}}
						>
							New Chat <LucidePlusSquare aria-hidden />
						</AnchorListItem>
					</UnorderedList>
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

						<AnchorListItem href='profile'>
							Settings <LucideSettings aria-hidden />
						</AnchorListItem>

						<AnchorListItem href='profile'>
							Logout <LucideLogOut aria-hidden />
						</AnchorListItem>
					</UnorderedList>
				</div>

				<h6 className='text-xs text-muted-foreground text-center mt-10'>
					Copyright © 2024 Minitron. All rights reserved
				</h6>

				<Button
					className='absolute top-1/2 -translate-y-1/2 -right-10'
					variant='icon'
					size='icon'
					title={!isSidebarVisible ? 'Close Sidebar' : 'Open Sidebar'}
					aria-label={!isSidebarVisible ? 'Close Sidebar' : 'Open Sidebar'}
					onClick={() =>
						setIsSidebarVisible((isSidebarVisible) => !isSidebarVisible)
					}
				>
					<LucideChevronRight
						className={`text-muted-foreground size-7 ${
							!isSidebarVisible ? 'rotate-180' : 'rotate-0'
						}`}
					/>
				</Button>
			</nav>
		);
	}
);

Sidebar.displayName = 'Sidebar';
