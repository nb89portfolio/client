'use client';

import { ErrorInfo, ReactNode, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from './fallback';

export default function ErrorWrapper({ children }: { children: ReactNode }) {
	const [getErrorRecord, setErrorRecord] = useState<
		{ name: string; message: string; stack: string }[]
	>([]);

	function logError(error: Error, info: ErrorInfo) {
		const findDuplicate = getErrorRecord.find((errorRecord) => {
			return error.name === errorRecord.name
				? error.message === errorRecord.message
					? error.stack === errorRecord.stack
						? {
								name: error.name,
								message: error.message,
								stack: error.stack,
						  }
						: undefined
					: undefined
				: undefined;
		});

		const hasDuplicate = findDuplicate !== undefined;

		if (!hasDuplicate) {
		}
	}

	return (
		
		<ErrorBoundary
			FallbackComponent={ErrorFallback}
			onError={logError}>
			{children}
		</ErrorBoundary>
	);
}
