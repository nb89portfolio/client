'use client';

import { ErrorInfo, ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from './fallback';
import defineError, { DefinedError } from '../../functions/definedError';
import catchFatalError from '../../functions/catchFatalError';
import useErrorStore, { ErrorStore } from '../../stores/errorStore';
import useApplicationStore, {
	ApplicationStore,
} from '../../stores/applicationStore';

type FetchConfiguration = {
	method: 'POST';
	body: string;
	headers: { 'content-type': 'application/json' };
};

async function sendServer(sendRequest: DefinedError): Promise<string> {
	const fetchConfiguration: FetchConfiguration = {
		method: 'POST',
		body: JSON.stringify(sendRequest),
		headers: { 'content-type': 'application/json' },
	};

	try {
		const response = await fetch('./api/error', fetchConfiguration);
		return await response.json();
	} catch (error) {
		return catchFatalError(error);
	}
}

function findError(definedError: DefinedError, errorList: DefinedError[]) {
	return errorList.findIndex((error) => {
		return (
			error.name === definedError.name &&
			error.message === definedError.message
		);
	});
}

function logError(
	error: any,
	info: ErrorInfo,
	errorStore: ErrorStore,
	applicationStore: ApplicationStore
) {
	const definedError = defineError(error);

	const foundDuplicateError = findError(definedError, errorStore.list);

	const hasDuplicateError = foundDuplicateError !== -1;

	const clientStatus = hasDuplicateError
		? 'Error has already been logged and submitted to server.'
		: 'Error has been logged and submitted to server.';

	applicationStore.setClientStatus(clientStatus);

	if (!hasDuplicateError) {
		errorStore.updateList(definedError);

		sendServer(definedError)
			.then((response) => {
				applicationStore.setServerStatus(response);
			})
			.catch((error) => {
				const message = catchFatalError(error);
				applicationStore.setClientStatus(message);
			});
	}
}

function resetState(applicationStore: ApplicationStore) {
	applicationStore.setClientStatus('Error boundary has been reset.');
	applicationStore.setServerStatus('');
}

export default function ErrorBoundaryWrapper({
	children,
}: {
	children: ReactNode;
}) {
	const errorStore = useErrorStore((state) => state);
	const applicationStore = useApplicationStore((state) => state);

	return (
		<>
			<ErrorBoundary
				FallbackComponent={ErrorFallback}
				onError={(error, info) =>
					logError(error, info, errorStore, applicationStore)
				}
				onReset={() => resetState(applicationStore)}>
				{children}
			</ErrorBoundary>
		</>
	);
}
