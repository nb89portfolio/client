import { cacheGetError, cacheSetError } from '@/cache/error';
import catchFatalError from '@/functions/catchFatalError';
import { DefinedError } from '@/functions/definedError';
import {
	prismaCreateError,
	prismaFindError,
	prismaUpdateError,
} from '@/prisma/error';
import { DocumentedError } from '@prisma/client';

function isError(action: string | DocumentedError): Response {
	const isError = typeof action === 'string';

	if (isError) {
		return Response.json(action, { status: 500 });
	} else {
		return Response.json('Error is updated or created.', { status: 200 });
	}
}

async function prismaAction(
	error: DefinedError,
	found: DocumentedError | null,
	foundRecord: boolean
) {
	if (foundRecord) {
		const isNotNull = found !== null;
		if (isNotNull) {
			const updateRecord = await prismaUpdateError(found);
			return isError(updateRecord);
		} else {
			return Response.json('Error not found.', { status: 404 });
		}
	} else {
		const createRecord = await prismaCreateError(error);
		return isError(createRecord);
	}
}

async function cacheData(
	error: DefinedError,
	found: DocumentedError | null,
	foundRecord: boolean
) {
	const isCached = cacheSetError(error, found);

	if (isCached) {
		return prismaAction(error, found, foundRecord);
	} else {
		return Response.json('Cache failure.', { status: 500 });
	}
}

export async function POST(request: Request) {
	try {
		const error: DefinedError = await request.json();

		const cache = cacheGetError();

		const cacheDefined = cache !== undefined;

		if (cacheDefined) {
			const findInCache = cache.found.find((recordedError) => {
				return (
					recordedError.name === error.name &&
					recordedError.message === error.message
				);
			});

			const foundRecord = findInCache !== undefined;

			return await cacheData(error, null, foundRecord);
		} else {
			const findRecord = await prismaFindError(error);

			const isError = typeof findRecord === 'string';

			if (isError) {
				return Response.json(findRecord, { status: 500 });
			} else {
				const foundRecord = findRecord !== null;

				return await cacheData(error, findRecord, foundRecord);
			}
		}
	} catch (error) {
		const response = catchFatalError(error);

		return Response.json(response, { status: 500 });
	}
}
