'use client';

import { ErrorInfo, ReactNode, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from './fallback';

type ErrorProperties = {
	name: string;
	message: string;
	stack: string;
};

export function defineError(error: any): ErrorProperties {
	const isTypeError = error instanceof Error;

	return {
		name: isTypeError ? error.name : 'Error name is unknown.',
		message: isTypeError ? error.message : 'Error name is unknown.',
		stack: isTypeError
			? error.stack !== undefined
				? error.stack
				: 'Error stack is undefined.'
			: 'Error name is unknown.',
	};
}

function hasDuplicateError(
	error: ErrorProperties,
	errorList: ErrorProperties[]
): boolean {
	const foundDuplicateErrors = errorList.find((recordedError) => {
		if (error.name === recordedError.name) {
			if (error.message === recordedError.message) {
				if (error.stack === recordedError.stack) {
					return recordedError;
				}
			}
		}
	});

	const duplicateErrorFound = foundDuplicateErrors !== undefined;

	return duplicateErrorFound;
}

type ServerReturn = {
	data: string | undefined;
	errorProperties: ErrorProperties | undefined;
};

async function submitError(
	errorProperties: ErrorProperties
): Promise<ServerReturn> {
	try {
		const response = await fetch('./api/error', {
			method: 'POST',
			body: JSON.stringify(errorProperties),
			headers: {
				'content-type': 'application/json',
			},
		});

		const data: string = await response.json(); // work on server end point

		return {
			data,
			errorProperties: undefined,
		};
	} catch (error) {
		const errorProperties = defineError(Error);
		return {
			data: undefined,
			errorProperties,
		};
	}
}

export default function ErrorBoundaryWrapper({
	children,
}: {
	children: ReactNode;
}) {
	const [getErrorRecord, setErrorRecord] = useState<ErrorProperties[]>([]);

	function logError(error: Error, info: ErrorInfo) {
		const errorProperties = defineError(error);

		const foundDuplicateError = hasDuplicateError(
			errorProperties,
			getErrorRecord
		);

		if (!foundDuplicateError) {
			const newList = [...getErrorRecord, errorProperties];

			setErrorRecord(newList);

			// continue with submit errors
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
