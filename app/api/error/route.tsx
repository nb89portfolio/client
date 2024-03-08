import nodeCache from '@/cache/cache';
import catchFatalError from '@/functions/catchFatalError';
import { DefinedError } from '@/functions/definedError';
import prismaClient from '@/prisma/prisma';
import { DocumentedError } from '@prisma/client';

async function findingDuplicateError(
	response: DefinedError
): Promise<DocumentedError | null> {
	const cacheGet = nodeCache.get('duplicateError');
	const cacheDefined = cacheGet !== undefined;

	console.log('cacheDefined', cacheDefined);

	if (cacheDefined) {
		return cacheGet as DocumentedError | null;
	} else {
		const findDuplicateError = await prismaClient.documentedError.findFirst(
			{
				where: {
					name: response.name,
					message: response.message,
					stack: response.stack,
				},
			}
		);

		return findDuplicateError;
	}
}

export async function POST(request: Request) {
	try {
		const clientRequest: DefinedError = await request.json();

		const findDuplicateError = await findingDuplicateError(clientRequest);

		const cacheSet = nodeCache.set('duplicateError', findDuplicateError, 0);

		if (cacheSet) {
			const foundDuplicateError = findDuplicateError !== null;

			if (foundDuplicateError) {
				await prismaClient.documentedError.update({
					where: {
						id: findDuplicateError.id,
					},
					data: {
						updated: new Date(),
						priority: findDuplicateError.priority + 1,
					},
				});

				return Response.json('This error has already been reported.', {
					status: 200,
				});
			} else {
				await prismaClient.documentedError.create({
					data: {
						name: clientRequest.name,
						message: clientRequest.message,
						stack: clientRequest.stack,
						created: new Date(),
						updated: new Date(),
					},
				});

				return Response.json('Error has been reported.', {
					status: 200,
				});
			}
		} else {
			return Response.json('Cache error has occurred.', {
				status: 500,
			});
		}
	} catch (error) {
		return Response.json(catchFatalError(error), { status: 500 });
	}
}
