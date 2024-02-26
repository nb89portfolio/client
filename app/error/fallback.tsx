'use client';

import { FallbackProps } from 'react-error-boundary';

function defineError(error: any): {
	name: string;
	message: string;
	stack: string;
} {
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

export default function ErrorFallback({
	error,
	resetErrorBoundary,
}: FallbackProps) {
	const { name, message, stack } = defineError(error);

	return (
		<main>
			<h2>Error</h2>
			<p>{name}</p>
			<p>{message}</p>
			<details>{stack}</details>
			<button onClick={resetErrorBoundary}>Reset Error</button>
		</main>
	);
}
