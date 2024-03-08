import { DefinedError } from '@/functions/definedError';
import { DocumentedError, PrismaClient } from '@prisma/client';

export async function prismaFindDuplicateError(
	request: DefinedError
): Promise<{ data: DocumentedError | null; validated: boolean }> {
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
