import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export type DefinedError = {
	name: string;
	message: string;
	stack: string;
};

export default function defineError(error: any): DefinedError {
	const isError =
		error instanceof Error ||
		error instanceof PrismaClientKnownRequestError;

	if (isError) {
		const { name, message } = error;

		const stack =
			error.stack !== undefined
				? error.stack
				: 'Error stack is undefined.';

		return { name, message, stack };
	} else {
		return {
			name: 'Error name is unknown.',
			message: 'Error message is unknown.',
			stack: 'Error stack is unknown.',
		};
	}
}
