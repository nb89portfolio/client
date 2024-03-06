import { ServerResponse } from '../api/serverSubmit';
import defineErrorProperties from './definedErrorProperties';

export default function catchError(error: any): ServerResponse {
	const data = undefined;
	const errorProperties = defineErrorProperties(error);

	return { data, errorProperties };
}
