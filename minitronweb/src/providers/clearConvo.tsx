'use client';

import {
	Dispatch,
	ReactNode,
	SetStateAction,
	createContext,
	useState,
} from 'react';

type ClearConvoProps = {
	forceClear: boolean;
	setForceClear: Dispatch<SetStateAction<boolean>>;
	chatSummarize: string[];
	setChatSummarize: Dispatch<SetStateAction<string[]>>;
	idHistory: number[];
	setIdHistory: Dispatch<SetStateAction<number[]>>;
	newChat: boolean;
	setNewChat: Dispatch<SetStateAction<boolean>>;
};

export const ClearConvoCtx = createContext<ClearConvoProps>({
	forceClear: false,
	setForceClear: () => {},
	chatSummarize: [],
	setChatSummarize: () => {
		[];
	},
	idHistory: [],
	setIdHistory: () => {
		[];
	},
	newChat: true,
	setNewChat: () => {},
});

export function ClearConvo({ children }: { children: ReactNode }) {
	const [forceClear, setForceClear] = useState(false);
	const [chatSummarize, setChatSummarize] = useState<string[]>([]);
	const [idHistory, setIdHistory] = useState<number[]>([]);
	const [newChat, setNewChat] = useState(true);
	return (
		<ClearConvoCtx.Provider
			value={{
				forceClear,
				setForceClear,
				chatSummarize,
				setChatSummarize,
				idHistory,
				setIdHistory,
				newChat,
				setNewChat,
			}}
		>
			{children}
		</ClearConvoCtx.Provider>
	);
}
