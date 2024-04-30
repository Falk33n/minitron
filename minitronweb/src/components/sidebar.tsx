'use client';

import {
	LucideBadgeInfo,
	LucideChevronRight,
	LucideHome,
	LucidePhoneForwarded,
	LucideSquareUserRound,
} from 'lucide-react';
import { HTMLAttributes, forwardRef, useState } from 'react';
import { cn } from '../utilities/shadUtilities';
import { AnchorListItem } from './anchorListItem';
import { Button } from './ui/button';
import { UnorderedList } from './unorderedList';

export interface SidebarProps extends HTMLAttributes<HTMLElement> {}

export const Sidebar = forwardRef<HTMLElement, SidebarProps>(
	({ className, children, ...props }, ref) => {
		const [isSidebarVisible, setIsSidebarVisible] = useState(false);

		return (
			<nav
				className={cn(
					`bg-white w-60 h-screen top-0 py-8 px-6 flex flex-col justify-between border-r border-r-light transition-all duration-300 ${
						isSidebarVisible
							? 'relative left-0 shadow-navbar'
							: 'absolute -left-[15rem] shadow-navbar-hidden'
					}`,
					className
				)}
				ref={ref}
				{...props}
			>
				<div className='relative mt-6'>
					<UnorderedList>
						<AnchorListItem href='/'>
							Home <LucideHome />
						</AnchorListItem>
						<AnchorListItem href='/login'>
							Log In <LucideSquareUserRound />
						</AnchorListItem>
						{/* <AnchorListItem href='/chat'>////////////////// ONLY SHOW WHEN LOGGED IN
							New Chat <LucideFilePen />
						</AnchorListItem> */}
					</UnorderedList>
				</div>

				<div className='relative flex-1 flex flex-col justify-end'>
					<UnorderedList>
						<AnchorListItem href='/about'>
							About <LucideBadgeInfo />
						</AnchorListItem>
						<AnchorListItem href='/contact'>
							Contact <LucidePhoneForwarded />
						</AnchorListItem>
					</UnorderedList>
				</div>

				<h6 className='text-xs text-muted-foreground text-center mt-10'>
					Copyright © 2024 Minitron. All rights reserved
				</h6>

				<Button
					className='absolute top-1/2 -translate-y-1/2 -right-10'
					variant='navbar'
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
		);
	}
);

Sidebar.displayName = 'Sidebar';
