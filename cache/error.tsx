import { DocumentedError } from '@prisma/client';
import nodeCache from './cache';
import { DefinedError } from '@/functions/definedError';

type CacheError = {
	error: DefinedError[];
	found: DocumentedError[];
};

export function cacheSetError(
	error: DefinedError,
	found: DocumentedError
): boolean {
	const get = nodeCache.get('error');
	const parsed = get as CacheError;

	const data: CacheError = {
		error: [...parsed.error, error],
		found: [...parsed.found, found],
	};

	return nodeCache.set('error', data);
}

export function cacheGetError(): CacheError | undefined {
	const data = nodeCache.get('error');

	return data as CacheError | undefined;
}
