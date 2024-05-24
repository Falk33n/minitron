'use client';

import {
	Dispatch,
	ReactNode,
	SetStateAction,
	createContext,
	useState,
} from 'react';

type GptCtxProps = {
	name: string;
	setName: Dispatch<SetStateAction<string>>;
	description: string;
	setDescription: Dispatch<SetStateAction<string>>;
	systemPrompt: string;
	setSystemPrompt: Dispatch<SetStateAction<string>>;
	tone: string;
	setTone: Dispatch<SetStateAction<string>>;
	style: string;
	setStyle: Dispatch<SetStateAction<string>>;
	starters: string;
	setStarters: Dispatch<SetStateAction<string>>;
};

export const GetGptDataCtx = createContext<GptCtxProps>({
	name: '',
	setName: () => {},
	description: '',
	setDescription: () => {},
	systemPrompt: '',
	setSystemPrompt: () => {},
	tone: '',
	setTone: () => {},
	style: '',
	setStyle: () => {},
	starters: '',
	setStarters: () => {},
});

export function GetGptData({ children }: { children: ReactNode }) {
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [systemPrompt, setSystemPrompt] = useState('');
	const [tone, setTone] = useState('');
	const [style, setStyle] = useState('');
	const [starters, setStarters] = useState('');

	return (
		<GetGptDataCtx.Provider
			value={{
				name,
				setName,
				description,
				setDescription,
				systemPrompt,
				setSystemPrompt,
				tone,
				setTone,
				style,
				setStyle,
				starters,
				setStarters,
			}}
		>
			{children}
		</GetGptDataCtx.Provider>
	);
}
