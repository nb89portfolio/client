'use client';

import { ErrorInfo, ReactNode, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from './fallback';
import defineError, { ErrorProperties } from './definedError';
import hasDuplicateError from './hasDuplicateError';
import submitError from './submitError';
import ErrorOutput from './output';
import { ServerReturn } from '../api/error/route';

export default function ErrorBoundaryWrapper({
	children,
}: {
	children: ReactNode;
}) {
	const [getErrorRecord, setErrorRecord] = useState<ErrorProperties[]>([]);
	const [getServerState, setServerState] = useState<ServerReturn>({
		data: '',
		errorProperties: undefined,
	});

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
					setServerState(response);
				})
				.catch((error) => {
					const { name, message, stack } = defineError(error);

					const data = {
						data: undefined,
						errorProperties: {
							name,
							message,
							stack,
						},
					};

					setServerState(data);
				});
		} else {
			const data = {
				data: 'This error has already been reported.',
				errorProperties: undefined,
			};

			setServerState(data);
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
