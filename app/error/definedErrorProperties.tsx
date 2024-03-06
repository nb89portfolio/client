export type ErrorProperties = {
	name: string;
	message: string;
	stack: string;
};

function getUnknownErrorDefinitions(): ErrorProperties {
	const name = 'Error name is unknown.';
	const message = 'Error message is unknown.';
	const stack = 'Error stack is unknown';

	return { name, message, stack };
}

function getKnownErrorDefinitions(error: Error): ErrorProperties {
	const name = error.name;
	const message = error.message;
	const stack =
		error.stack !== undefined ? error.stack : 'Error stack is undefined.';

	return { name, message, stack };
}

function determineProcess(
	isTypeError: boolean
): ((error: Error) => ErrorProperties) | (() => ErrorProperties) {
	const process = isTypeError
		? getKnownErrorDefinitions
		: getUnknownErrorDefinitions;

	return process;
}

export default function defineErrorProperties(error: any): ErrorProperties {
	const isTypeError = error instanceof Error;
	const processor = determineProcess(isTypeError);
	const errorDefinition = processor(error);

	return errorDefinition;
}
