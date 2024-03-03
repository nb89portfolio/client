import defineErrorProperties, {
	ErrorProperties,
} from '../error/definedErrorProperties';
import catchError from '../error/catchError';
import { ErrorResponse } from './error/route';

export type ServerResponse = {
	data: ErrorResponse | undefined;
	errorProperties: ErrorProperties | undefined;
};

type ServerRoute = './api/error';

type FetchMethod = 'POST';

type FetchConfiguration = {
	method: FetchMethod;
	body: string;
	headers: {
		'content-type': 'application/json';
	};
};

type ServerRequest = ErrorProperties;

export default async function sendServer(
	route: ServerRoute,
	method: FetchMethod,
	request: ServerRequest
): Promise<ServerResponse> {
	const fetchConfiguration: FetchConfiguration = {
		method: method,
		body: JSON.stringify(request),
		headers: { 'content-type': 'application/json' },
	};

	try {
		const response = await fetch(route, fetchConfiguration);

		const data = await response.json();

		return {
			data,
			errorProperties: undefined,
		};
	} catch (error) {
		return catchError(error);
	}
}
