import {
	nodeCacheFindError,
	nodeCacheGetError,
	nodeCacheSetError,
} from '@/cache/error';
import { DefinedError } from '@/functions/definedError';
import {
	prismaCreateError,
	prismaFindError,
	prismaUpdateError,
} from '@/prisma/error';
import { DocumentedError } from '@prisma/client';

async function findDuplicateRecord(
	definedError: DefinedError,
	cachedData: DocumentedError[] | undefined
): Promise<DocumentedError | undefined | null | string> {
	const isDefined = cachedData !== undefined;

	return isDefined
		? nodeCacheFindError(definedError, cachedData)
		: await prismaFindError(definedError);
}

function validateFoundRecords(
	findRecords: DocumentedError | undefined | null | string
): boolean {
	return (
		findRecords !== undefined &&
		findRecords !== null &&
		typeof findRecords !== 'string'
	);
}

async function resolveActions(
	findRecords: DocumentedError | undefined | null | string,
	definedError: DefinedError
): Promise<Response> {
	const isFoundDefined = validateFoundRecords(findRecords);

	const action = isFoundDefined
		? await prismaUpdateError(findRecords as DocumentedError)
		: await prismaCreateError(definedError);

	const isError =
		typeof action === 'string' && action !== undefined && action !== null;

	const isCached = !isError ? nodeCacheSetError(action) : false;

	console.log(isCached);

	const response = isError
		? action
		: isCached
		? 'Error has been reported.'
		: 'Error with caching.';

	const status = isError ? 500 : isCached ? 200 : 500;

	return Response.json(response, { status });
}

export async function POST(request: Request) {
	const definedError: DefinedError = await request.json();

	const cachedData = nodeCacheGetError();

	const findRecords = await findDuplicateRecord(definedError, cachedData);

	return await resolveActions(findRecords, definedError);
}
