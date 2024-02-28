import { ServerReturn } from '../api/error/route';

export default function ErrorOutput({ props }: { props: ServerReturn }) {
	const data =
		props.data !== undefined
			? props.data
			: props.errorProperties !== undefined
			? `Error name "${props.errorProperties.name}" \nwith error message "${props.errorProperties.message}" \nand error stack "${props.errorProperties.stack}"`
			: 'Error: System failed to report error.';

	return <output>{data}</output>;
}
