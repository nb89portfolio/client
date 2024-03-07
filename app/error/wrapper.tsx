'use client';

import { ErrorInfo, ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from './fallback';
import defineError, { DefinedError } from './definedError';
import catchFatalError from './catchFatalError';
import useErrorStore, { ErrorStore } from './store';
import useApplicationStore, { ApplicationStore } from '../store';

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
	const errorStore = useErrorStore((state) => state);
	const applicationStore = useApplicationStore((state) => state);

	function logError(error: any, info: ErrorInfo) {
		const definedError = defineError(error);
		const errorList = errorStore.list;

		const foundDuplicateError = errorList.findIndex((error) => {
			return (
				error.name === definedError.name &&
				error.message === definedError.message
			);
		});

		const hasDuplicateError = foundDuplicateError !== -1;

		if (hasDuplicateError) {
			applicationStore.setClientStatus(
				'Error has already been logged and submitted to server.'
			);
		} else {
			applicationStore.setClientStatus(
				'Error has been logged and submitted to server.'
			);

			errorStore.updateList(definedError);

			sendServer(definedError)
				.then((response) => {
					applicationStore.setServerStatus(response);
				})
				.catch((error) => {
					applicationStore.setClientStatus(catchFatalError(error));
				});
		}
	}

	function resetState() {
		applicationStore.setClientStatus('Error boundary has been reset.');
		applicationStore.setServerStatus('');
	}

	return (
		<>
			<ErrorBoundary
				FallbackComponent={ErrorFallback}
				onError={logError}
				onReset={resetState}>
				{children}
			</ErrorBoundary>
		</>
	);
}
