import { ErrorProperties } from './definedError';

export default function hasDuplicateError(
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
