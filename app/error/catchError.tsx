import { ServerResponse } from '../api/serverSubmit';
import defineError from './definedError';

export default function catchError(error: any): ServerResponse {
	return {
		data: undefined,
		definedError: defineError(error),
	};
}
