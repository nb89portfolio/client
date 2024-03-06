import defineError, { DefinedError } from '@/app/error/definedError';
import { PrismaClient } from '@prisma/client';

export type ErrorResponse = string;

export async function POST(request: Request) {
	try {
		const clientRequest: DefinedError = await request.json();
		const databaseClient = new PrismaClient();
	} catch (error) {
		const { name, message, stack } = defineError(error);

		const data = `Error name "${name}" \nwith error message "${message}" \nand error stack "${stack}"`;

		return Response.json(
			{ data, errorProperties: undefined },
			{ status: 500 }
		);
	}
}
