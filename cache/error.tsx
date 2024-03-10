import { DocumentedError } from '@prisma/client';
import nodeCache from './cache';
import { DefinedError } from '@/functions/definedError';

export function nodeCacheGetError(): DocumentedError[] | undefined {
	const data = nodeCache.get('error');
	const assert = data as DocumentedError[] | undefined;
	return assert;
}

function buildCacheData(
	cachedData: DocumentedError[] | undefined,
	documentedError: DocumentedError
): DocumentedError[] {
	const isCacheDefined = cachedData !== undefined;

	return isCacheDefined
		? [...cachedData, documentedError]
		: [documentedError];
}

function buildCacheTTL(time: {
	seconds: number;
	minutes: number;
	hours: number;
}): number {
	const { hours, minutes, seconds } = time;

	const hourMinutes = hours * 60;
	const hourSeconds = hourMinutes * 60;
	const minuteSeconds = minutes * 60;

	return seconds + minuteSeconds + hourSeconds;
}

export function nodeCacheSetError(documentedError: DocumentedError): boolean {
	const cachedData = nodeCacheGetError();

	const setData = buildCacheData(cachedData, documentedError);

	const setTTL = buildCacheTTL({ hours: 24, minutes: 0, seconds: 0 });

	return nodeCache.set('error', setData, setTTL);
}

export function nodeCacheFindError(
	definedError: DefinedError,
	cachedData: DocumentedError[]
): DocumentedError | undefined {
	return cachedData.find((error) => {
		return (
			error.name === definedError.name &&
			error.message === definedError.message
		);
	});
}
