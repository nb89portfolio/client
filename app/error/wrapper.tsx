'use client';

import { ErrorInfo, ReactNode, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from './fallback';
import defineError, { ErrorProperties } from './definedError';
import hasDuplicateError from './hasDuplicateError';
import submitError from './submitError';

export default function ErrorBoundaryWrapper({
	children,
}: {
	children: ReactNode;
}) {
	const [getErrorRecord, setErrorRecord] = useState<ErrorProperties[]>([]);
	const [getServerState, setServerState] = useState<string>('');

	function logError(error: Error, info: ErrorInfo) {
		const errorProperties = defineError(error);

		const foundDuplicateError = hasDuplicateError(
			errorProperties,
			getErrorRecord
		);

		if (!foundDuplicateError) {
			const newList = [...getErrorRecord, errorProperties];

			setErrorRecord(newList);

			submitError(errorProperties)
				.then((response) => {
					const data =
						response.data !== undefined
							? response.data
							: 'Error: Server failed to process error.';

					setServerState(data);
				})
				.catch((error) => {
					const { name, message, stack } = defineError(error);

					const data = `Client failed to report to server about error.\n${name}.\n${message}.\n${stack}.\n`;

					setServerState(data);
				});
		} else {
			const data = 'This error has already been reported.';

			setServerState(data);
		}
	}

	function resetState() {
		setServerState('');
	}

	return (
		<>
			<ErrorBoundary
				FallbackComponent={ErrorFallback}
				onError={logError}
				onReset={resetState}>
				{children}
			</ErrorBoundary>
			<output>{getServerState}</output>
		</>
	);
}
