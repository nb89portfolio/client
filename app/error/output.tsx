import { ServerResponse } from '../api/serverSubmit';
import { ErrorProperties } from './definedErrorProperties';

function defineOutput(serverResponse: ServerResponse): string {
	if (serverResponse.data !== undefined) {
		return serverResponse.data as string;
	} else {
		if (serverResponse.errorProperties !== undefined) {
			const { name, message, stack } =
				serverResponse.errorProperties as ErrorProperties;

			return `Error name "${name}" \nwith error message "${message}" \nand error stack "${stack}"`;
		} else {
			return 'Error: System failed to report error.';
		}
	}
}

export default function ErrorOutput({ props }: { props: ServerResponse }) {
	return <output>{defineOutput(props)}</output>;
}
