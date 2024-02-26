import { FallbackProps } from 'react-error-boundary';

export default function ErrorFallback({
	error,
	resetErrorBoundary,
}: FallbackProps) {
	return (
		<main>
			<h2>Error</h2>
		</main>
	);
}
