'use client';

import { ReactNode, Suspense } from 'react';

export function Suspensed({ children }: { children: ReactNode }) {
	return <Suspense>{children}</Suspense>;
}
