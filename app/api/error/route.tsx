import { cacheGetError, cacheSetError } from '@/cache/error';
import catchFatalError from '@/functions/catchFatalError';
import { DefinedError } from '@/functions/definedError';
import {
	prismaCreateError,
	prismaFindError,
	prismaUpdateError,
} from '@/prisma/error';

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

			if (foundRecord) {
				const updateRecord = await prismaUpdateError(findInCache);

				const isError = typeof updateRecord === 'string';

				if (isError) {
					return Response.json(updateRecord, { status: 500 });
				} else {
					return Response.json('Error updated.', { status: 200 });
				}
			} else {
				const createRecord = await prismaCreateError(error);

				const isError = typeof createRecord === 'string';

				if (isError) {
					return Response.json(createRecord, { status: 500 });
				} else {
					return Response.json('Error created.', { status: 200 });
				}
			}
		} else {
			const findRecord = await prismaFindError(error);

			const isError = typeof findRecord === 'string';

			if (isError) {
				return Response.json(findRecord, { status: 500 });
			} else {
				const foundRecord = findRecord !== null;

				if (foundRecord) {
					const isCached = cacheSetError(error, findRecord);

					if (isCached) {
						const updateRecord = await prismaUpdateError(
							findRecord
						);

						const isError = typeof updateRecord === 'string';

						if (isError) {
							return Response.json(updateRecord, { status: 500 });
						} else {
							return Response.json('Error updated.', {
								status: 200,
							});
						}
					} else {
						return Response.json('Cache failure.', { status: 500 });
					}
				} else {
					const createRecord = await prismaCreateError(error);

					const isError = typeof createRecord === 'string';

					if (isError) {
						return Response.json(createRecord, { status: 500 });
					} else {
						return Response.json('Error created.', { status: 200 });
					}
				}
			}
		}
	} catch (error) {
		const response = catchFatalError(error);

		return Response.json(response, { status: 500 });
	}
}
