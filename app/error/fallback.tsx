'use client';

import { FallbackProps } from 'react-error-boundary';
import defineError from './definedError';


export default function ErrorFallback({
	error,
	resetErrorBoundary,
}: FallbackProps) {
	const { name, message, stack } = defineError(error);

	console.log('rerendering fallback');

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
