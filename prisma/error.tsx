import { DefinedError } from '@/functions/definedError';
import { DocumentedError, PrismaClient } from '@prisma/client';

type PrismaErrorResponse = {
	data: DocumentedError | null;
	validated: boolean;
};

export async function prismaFindDuplicateError(
	request: DefinedError
): Promise<PrismaErrorResponse> {
	const prismaClient = new PrismaClient();

	const data = await prismaClient.documentedError.findFirst({
		where: {
			name: request.name,
			message: request.message,
			stack: request.stack,
		},
	});

	const validated = data !== null;

	return { data, validated };
}

export async function prismaUpdateDocumentedError(
	request: DocumentedError
): Promise<PrismaErrorResponse> {
	const prismaClient = new PrismaClient();

	const data = await prismaClient.documentedError.update({
		where: {
			id: request.id,
		},
		data: {
			updated: new Date(),
			priority: request.priority + 1,
		},
	});

	const validated = data !== null || data !== undefined;

	return { data, validated };
}

export async function prismaCreateDocumentedError(
	request: DocumentedError
): Promise<PrismaErrorResponse> {
	const prismaClient = new PrismaClient();

	const data = await prismaClient.documentedError.create({
		data: {
			name: request.name,
			message: request.message,
			stack: request.stack,
			created: new Date(),
			updated: new Date(),
		},
	});

	const validated = data !== null || data !== undefined;

	return { data, validated };
}
