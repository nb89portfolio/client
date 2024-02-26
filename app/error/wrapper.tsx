import { ErrorInfo, ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from './fallback';

function logError(error: Error, info: ErrorInfo) {}

export default function ErrorWrapper({ children }: { children: ReactNode }) {
	return (
		<ErrorBoundary
			FallbackComponent={ErrorFallback}
			onError={logError}>
			{children}
		</ErrorBoundary>
	);
}
