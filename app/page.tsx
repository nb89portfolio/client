'use client';

import { useErrorBoundary } from 'react-error-boundary';
import styles from '../styles/index.module.scss';

export default function Home() {
	const { showBoundary } = useErrorBoundary();

	const error = new Error('test');

	return (
		<main className={styles.main}>
			<h2>Home Page</h2>
			<p>This is my home page.</p>
			<button onClick={() => showBoundary(error)}>Throw error</button>
		</main>
	);
}
