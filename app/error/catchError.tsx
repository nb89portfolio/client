import { ServerResponse } from '../api/serverSubmit';
import defineErrorProperties from './definedErrorProperties';

export default function catchError(error: any): ServerResponse {
	return {
		data: undefined,
		errorProperties: defineErrorProperties(error),
	};
}
