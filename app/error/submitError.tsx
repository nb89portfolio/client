import { ServerReturn } from '../api/error/route';
import defineErrorProperties, {
	ErrorProperties,
} from './definedErrorProperties';

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

		const data: string = await response.json();

		return {
			data,
			errorProperties: undefined,
		};
	} catch (error) {
		const errorProperties = defineErrorProperties(Error);
		return {
			data: undefined,
			errorProperties,
		};
	}
}
