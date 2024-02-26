import { ReactNode, Suspense } from 'react';
import LoadingFallback from './fallback';

export default function LoadingWrapper({ children }: { children: ReactNode }) {
	return (
		<Suspense fallback={<LoadingFallback></LoadingFallback>}>
			{children}
		</Suspense>
	);
}
