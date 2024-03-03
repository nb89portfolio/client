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

export default function ErrorBoundaryWrapper({
	children,
}: {
	children: ReactNode;
}) {
	const [getErrorRecord, setErrorRecord] = useState<ErrorProperties[]>([]);
	const [getServerState, setServerState] = useState<ServerResponse>({
		data: '',
		errorProperties: undefined,
	});

	function logError(error: Error, info: ErrorInfo) {
		const errorProperties = defineErrorProperties(error);

		const foundDuplicateError = hasDuplicateError(
			errorProperties,
			getErrorRecord
		);

		if (!foundDuplicateError) {
			setErrorRecord([...getErrorRecord, errorProperties]);

			serverSubmit('./api/error', 'POST', errorProperties)
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
		setServerState({
			data: '',
			errorProperties: undefined,
		});
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
