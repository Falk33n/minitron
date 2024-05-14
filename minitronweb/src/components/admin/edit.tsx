'use client'

import { LucidePencil, LucideTrash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../forms/button';

export const Edit = ({show}: {show: boolean;}) => {
	const [edit, setEdit] = useState(false);

	return (
		<>
			{show && (
				<div onClick={() => setEdit((prev) => !prev)}>
					<LucidePencil />
					{edit && (
						<div>
							<Button>
								<LucidePencil />
							</Button>
							<Button>
								<LucideTrash2 />
							</Button>
						</div>
					)}
				</div>
			)}
		</>
	);
};
