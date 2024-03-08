'use client';

import useApplicationStore from '../stores/applicationStore';

export default function Footer() {
	const applicationStore = useApplicationStore((state) => state);

	return (
		<footer>
			<div>
				<label>Client:</label>
				<output>{applicationStore.client}</output>
			</div>
			<div>
				<label>Server:</label>
				<output>{applicationStore.server}</output>
			</div>
		</footer>
	);
}
