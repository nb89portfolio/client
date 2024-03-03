import { ErrorProperties } from './definedErrorProperties';

function findDuplicateError(
	error: ErrorProperties,
	errorList: ErrorProperties[]
): ErrorProperties | undefined {
	return errorList.find((recordedError) => {
		return error.name === recordedError.name
			? error.message === recordedError.message
				? error.stack === recordedError.stack
					? true
					: false
				: false
			: false;
	});
}

export default function hasDuplicateError(
	error: ErrorProperties,
	errorList: ErrorProperties[]
): boolean {
	return findDuplicateError(error, errorList) !== undefined;
}
