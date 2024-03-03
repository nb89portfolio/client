import { ServerReturn } from '../api/error/route';
import { ErrorProperties } from './definedErrorProperties';

function defineOutput(serverResponse: ServerReturn): string {
	const isDefined = serverResponse.data !== undefined;

	if (isDefined) {
		return serverResponse.data as string;
	} else {
		const isDefined = serverResponse.errorProperties !== undefined;

		if (isDefined) {
			const { name, message, stack } =
				serverResponse.errorProperties as ErrorProperties;

			return `Error name "${name}" \nwith error message "${message}" \nand error stack "${stack}"`;
		} else {
			return 'Error: System failed to report error.';
		}
	}
}

export default function ErrorOutput({ props }: { props: ServerReturn }) {
	const data = defineOutput(props);

	return <output>{data}</output>;
}
