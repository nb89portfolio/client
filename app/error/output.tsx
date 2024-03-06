import { ServerResponse } from '../api/serverSubmit';
import { DefinedError } from './definedError';

function defineOutput(serverResponse: ServerResponse): string {
	if (serverResponse.data !== undefined) {
		return serverResponse.data as string;
	} else {
		const isDefined = serverResponse.definedError !== undefined;

		if (isDefined) {
			const { name, message, stack } =
				serverResponse.definedError as DefinedError;

			const errorName = `Error name "${name}".`;
			const errorMessage = `Error message "${message}.`;
			const errorStack = `Error stack "${stack}".`;

			return errorName + `\n` + errorMessage + `\n` + errorStack;
		} else {
			return 'Error: System failed to report error.';
		}
	}
}

export default function ErrorOutput({ props }: { props: ServerResponse }) {
	const output = defineOutput(props);

	return <output>{output}</output>;
}
