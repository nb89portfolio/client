export type ErrorProperties = {
	name: string;
	message: string;
	stack: string;
};

function defineErrorString(
	key: keyof ErrorProperties,
	condition: 'undefined' | 'unknown'
): string {
	return `Error ${key} is ${condition}.`;
}

function defineErrorProperty(error: any, key: keyof ErrorProperties): string {
	const isError = error instanceof Error;

	if (isError) {
		const isDefined = error[key] !== undefined;

		if (isDefined) {
			return error[key] as string;
		} else {
			return defineErrorString(key, 'undefined');
		}
	} else {
		return defineErrorString(key, 'unknown');
	}
}

export default function defineErrorProperties(error: any): ErrorProperties {
	return {
		name: defineErrorProperty(error, 'name'),
		message: defineErrorProperty(error, 'message'),
		stack: defineErrorProperty(error, 'stack'),
	};
}
