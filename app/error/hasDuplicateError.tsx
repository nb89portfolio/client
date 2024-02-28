import { ErrorProperties } from './definedError';

function findDuplicateError(
	error: ErrorProperties,
	errorList: ErrorProperties[]
): ErrorProperties | undefined {
	return errorList.find((recordedError) => {
		if (error.name === recordedError.name) {
			if (error.message === recordedError.message) {
				if (error.stack === recordedError.stack) {
					return recordedError;
				}
			}
		}
	});
}

export default function hasDuplicateError(
	error: ErrorProperties,
	errorList: ErrorProperties[]
): boolean {
	const foundDuplicateError = findDuplicateError(error, errorList);

	const hasDuplicateErrorFound = foundDuplicateError !== undefined;

	return hasDuplicateErrorFound;
}
