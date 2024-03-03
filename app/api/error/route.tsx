import defineErrorProperties, {
	ErrorProperties,
} from '@/app/error/definedErrorProperties';
import { PrismaClient } from '@prisma/client';

export type ServerReturn = {
	data: string | undefined;
	errorProperties: ErrorProperties | undefined;
};

export async function POST(request: Request) {
	try {
		const clientRequest: ErrorProperties = await request.json();
		const databaseClient = new PrismaClient();
	} catch (error) {
		const { name, message, stack } = defineErrorProperties(error);

		const data = `Error name "${name}" \nwith error message "${message}" \nand error stack "${stack}"`;

		return Response.json(
			{ data, errorProperties: undefined },
			{ status: 500 }
		);
	}
}
