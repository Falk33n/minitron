'use client';

import { Fragment, useContext, useEffect, useState } from 'react';
import { GetGptDataCtx } from '../../providers/getGptData';

type Starter = {
	starter: string;
};

export function StarterPrompts() {
	const { starters, starterPrompt, setStarterPrompt } =
		useContext(GetGptDataCtx);
	const [starterArray, setStarterArray] = useState<Starter[]>([]);

	useEffect(() => {
		if (starters.length === 4) {
			const starter = starters.map((starter) => ({ starter: starter.starter }));
			setStarterArray(starter);
		} //eslint-disable-next-line
	}, starters);

	return (
		<>
			{!starterPrompt && (
				<div className='absolute bottom-40 w-full flex flex-wrap items-center justify-center gap-6'>
					{starterArray.map((starter, i) => (
						<Fragment key={i}>
							{starter.starter !== '' ? (
								<div
									className='text-center bg-white border font-medium p-4 size-48 text-ellipsis overflow-hidden flex items-center justify-center rounded-2xl'
									onClick={() => setStarterPrompt(starter.starter)}
								>
									{starter.starter}
								</div>
							) : (
								<></>
							)}
						</Fragment>
					))}
				</div>
			)}
		</>
	);
}
