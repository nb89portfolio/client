import { DocumentedError } from '@prisma/client';
import nodeCache, { buildCacheTTL } from './cache';
import { DefinedError } from '@/functions/definedError';

type CacheError = {
	error: DefinedError[];
	found: DocumentedError[];
};

export function cacheSetError(
	error: DefinedError,
	found: DocumentedError | null
): boolean {
	const get = nodeCache.get('error');
	const parsed = get as CacheError;

	const isNotNull = found !== null;

	const cacheTTL = buildCacheTTL({
		seconds: 60,
		minutes: 0,
		hours: 0,
	});

	if (isNotNull) {
		const data: CacheError = {
			error: [...parsed.error, error],
			found: [...parsed.found, found],
		};

		return nodeCache.set('error', data, cacheTTL);
	} else {
		const data: CacheError = {
			error: [...parsed.error, error],
			found: parsed.found,
		};

		return nodeCache.set('error', data, cacheTTL);
	}
}

export function cacheGetError(): CacheError | undefined {
	const data = nodeCache.get('error');

	return data as CacheError | undefined;
}
