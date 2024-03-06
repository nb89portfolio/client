'use client';

import { ErrorInfo, ReactNode, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from './fallback';
import defineErrorProperties, {
	ErrorProperties,
} from './definedErrorProperties';
import hasDuplicateError from './hasDuplicateError';
import ErrorOutput from './output';
import serverSubmit, { ServerResponse } from '../api/serverSubmit';
import catchError from './catchError';

const initialServerResponse: ServerResponse = {
	data: '',
	errorProperties: undefined,
};

export default function ErrorBoundaryWrapper({
	children,
}: {
	children: ReactNode;
}) {
	const [getErrorRecord, setErrorRecord] = useState<ErrorProperties[]>([]);
	const [getServerState, setServerState] = useState<ServerResponse>(
		initialServerResponse
	);

	function logError(error: Error, info: ErrorInfo) {
		const errorProperties = defineErrorProperties(error);

		const foundDuplicateError = hasDuplicateError(
			errorProperties,
			getErrorRecord
		);

		if (!foundDuplicateError) {
			setErrorRecord([...getErrorRecord, errorProperties]);

			serverSubmit({
				route: './api/error',
				method: 'POST',
				request: errorProperties,
			})
				.then((response) => {
					setServerState(response);
				})
				.catch((error) => {
					setServerState(catchError(error));
				});
		} else {
			setServerState({
				data: 'This error has already been reported.',
				errorProperties: undefined,
			});
		}
	}

	function resetState() {
		setServerState(initialServerResponse);
	}

	return (
		<>
			<ErrorBoundary
				FallbackComponent={ErrorFallback}
				onError={logError}
				onReset={resetState}>
				{children}
			</ErrorBoundary>
			<ErrorOutput props={getServerState}></ErrorOutput>
		</>
	);
}
