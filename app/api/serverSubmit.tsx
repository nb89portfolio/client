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

type SendServerRequest = {
	route: ServerRoute;
	method: FetchMethod;
	request: ServerRequest;
};

export default async function sendServer(
	sendRequest: SendServerRequest
): Promise<ServerResponse> {
	const fetchConfiguration: FetchConfiguration = {
		method: sendRequest.method,
		body: JSON.stringify(sendRequest.request),
		headers: { 'content-type': 'application/json' },
	};

	try {
		return {
			data: await (await fetch(sendRequest.route, fetchConfiguration)).json(),
			errorProperties: undefined,
		};
	} catch (error) {
		return catchError(error);
	}
}
