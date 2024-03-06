import { ErrorProperties } from './definedErrorProperties';

function findDuplicateError(
	error: ErrorProperties,
	errorList: ErrorProperties[]
): ErrorProperties | undefined {
	const foundDuplicates = errorList.find((recordedError) => {
		const isMatch =
			error.name !== recordedError.name
				? false
				: error.message !== recordedError.message
				? false
				: error.stack !== recordedError.stack
				? false
				: true;

		return isMatch;
	});

	return foundDuplicates;
}

function isDuplicateError(
	foundDuplicateError: ErrorProperties | undefined
): boolean {
	const hasDuplciateError = foundDuplicateError !== undefined ? true : false;

	return hasDuplciateError;
}

export default function hasDuplicateError(
	error: ErrorProperties,
	errorList: ErrorProperties[]
): boolean {
	const foundDuplicateErrors = findDuplicateError(error, errorList);
	const hasDuplicateError = isDuplicateError(foundDuplicateErrors);

	return hasDuplicateError;
}
