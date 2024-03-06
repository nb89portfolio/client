import { DefinedError } from './definedError';

export default function hasDuplicateError(
	error: DefinedError,
	errorList: DefinedError[]
): boolean {
	const foundDuplicateErrors = errorList.find((recordedError) => {
		return error.name !== recordedError.name
			? false
			: error.message !== recordedError.message
			? false
			: error.stack !== recordedError.stack
			? false
			: true;
	});

	return foundDuplicateErrors !== undefined ? true : false;
}
