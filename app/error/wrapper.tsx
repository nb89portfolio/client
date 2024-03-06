'use client';

import { ErrorInfo, ReactNode, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from './fallback';
import defineError, { DefinedError } from './definedError';
import hasDuplicateError from './hasDuplicateError';
import catchFatalError from './catchFatalError';

async function sendServer(sendRequest: DefinedError): Promise<string> {
	const fetchConfiguration = {
		method: 'POST',
		body: JSON.stringify(sendRequest),
		headers: { 'content-type': 'application/json' },
	};

	try {
		const response = await fetch('./api/error', fetchConfiguration);
		const data = await response.json();

		return data;
	} catch (error) {
		return catchFatalError(error);
	}
}

export default function ErrorBoundaryWrapper({
	children,
}: {
	children: ReactNode;
}) {
	const [getErrorRecord, setErrorRecord] = useState<DefinedError[]>([]);
	const [getServerState, setServerState] = useState<string>('');

	function logError(error: Error, info: ErrorInfo) {
		const errorProperties = defineError(error);

		const foundDuplicateError = hasDuplicateError(
			errorProperties,
			getErrorRecord
		);

		if (!foundDuplicateError) {
			setErrorRecord([...getErrorRecord, errorProperties]);

			sendServer(errorProperties)
				.then((response) => {
					setServerState(response);
				})
				.catch((error) => {
					setServerState(catchFatalError(error));
				});
		} else {
			setServerState('This error has already been reported.');
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
