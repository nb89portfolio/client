import { ServerResponse } from '../api/serverSubmit';
import { ErrorProperties } from './definedErrorProperties';

function defineOutput(serverResponse: ServerResponse): string {
	if (serverResponse.data !== undefined) {
		return serverResponse.data as string;
	} else {
		const isDefined = serverResponse.errorProperties !== undefined;

		if (isDefined) {
			const { name, message, stack } =
				serverResponse.errorProperties as ErrorProperties;

			const messageName = `Error name "${name}".\n`;
			const messageMEssage = `Error message "${message}".\n`;
			const messageStack = `Error stack "${stack}".\n`;

			const buildMEssage = messageName + messageMEssage + messageStack;
			return buildMEssage;
		} else {
			const defaultMEssage = 'Error: System failed to report error.';

			return defaultMEssage;
		}
	}
}

export default function ErrorOutput({ props }: { props: ServerResponse }) {
	const output = defineOutput(props);

	return <output>{output}</output>;
}
