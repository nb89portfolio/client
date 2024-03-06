import catchFatalError from '@/app/error/catchFatalError';
import { DefinedError } from '@/app/error/definedError';
import { PrismaClient } from '@prisma/client';

export async function POST(request: Request) {
	try {
		const clientRequest: DefinedError = await request.json();
		const databaseClient = new PrismaClient();
		const findDuplicateError = await databaseClient.error.findFirst({
			where: {
				name: clientRequest.name,
				message: clientRequest.message,
				stack: clientRequest.stack,
			},
		});

		const foundDuplicateError = findDuplicateError !== null;

		if (foundDuplicateError) {
			await databaseClient.error.update({
				where: {
					id: findDuplicateError.id,
				},
				data: {
					updated: new Date(),
					priority: findDuplicateError.priority + 1,
				},
			});

			return Response.json('This error has already been reported', {
				status: 200,
			});
		} else {
			await databaseClient.error.create({
				data: {
					name: clientRequest.name,
					message: clientRequest.message,
					stack: clientRequest.stack,
					created: new Date(),
					updated: new Date(),
				},
			});

			return Response.json('Error has been reported', {
				status: 200,
			});
		}
	} catch (error) {
		return catchFatalError(error);
	}
}
