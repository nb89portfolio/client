import defineError, { ErrorProperties } from './definedError';

export type ServerReturn = {
	data: string | undefined;
	errorProperties: ErrorProperties | undefined;
};

export default async function submitError(
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
