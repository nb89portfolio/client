import { ServerResponse } from '../api/serverSubmit';
import defineErrorProperties from './definedErrorProperties';

export default function catchError(error: any): ServerResponse {
	const errorProperties = defineErrorProperties(Error);

	return {
		data: undefined,
		errorProperties,
	};
}
