export type ErrorProperties = {
	name: string;
	message: string;
	stack: string;
};

export default function defineError(error: any): ErrorProperties {
	const isTypeError = error instanceof Error;

	return {
		name: isTypeError ? error.name : 'Error name is unknown.',
		message: isTypeError ? error.message : 'Error name is unknown.',
		stack: isTypeError
			? error.stack !== undefined
				? error.stack
				: 'Error stack is undefined.'
			: 'Error name is unknown.',
	};
}
