'use client';

import useApplicationStore from './store';

export default function Footer() {
	const applicationStore = useApplicationStore((state) => state);

	return (
		<footer>
			<label>Client:</label>
			<output>{applicationStore.client}</output>
			<label>Server:</label>
			<output>{applicationStore.server}</output>
		</footer>
	);
}
