import defineError, { DefinedError } from '@/functions/definedError';
import { DocumentedError, PrismaClient } from '@prisma/client';
import prismaClient from './prisma';
import catchFatalError from '@/functions/catchFatalError';

export async function prismaFindError(request: DefinedError) {
	try {
		return await prismaClient.documentedError.findFirst({
			where: {
				name: request.name,
				message: request.message,
				stack: request.stack,
			},
		});
	} catch (error) {
		return catchFatalError(error);
	}
}

export async function prismaUpdateError(request: DocumentedError) {
	try {
		return await prismaClient.documentedError.update({
			where: {
				id: request.id,
			},
			data: {
				updated: new Date(),
				priority: request.priority + 1,
			},
		});
	} catch (error) {
		return catchFatalError(error);
	}
}

export async function prismaCreateError(request: DefinedError) {
	try {
		return await prismaClient.documentedError.create({
			data: {
				name: request.name,
				message: request.message,
				stack: request.stack,
				created: new Date(),
				updated: new Date(),
			},
		});
	} catch (error) {
		return catchFatalError(error);
	}
}
