import { DocumentedError } from '@prisma/client';
import nodeCache from './cache';
import { DefinedError } from '@/functions/definedError';

type CacheError = {
	reports: DefinedError[];
	records: DocumentedError[];
};

export function cacheGetError(): CacheError | undefined {
	return nodeCache.get('error') as CacheError | undefined;
}

function buildCacheData(
	oldData: CacheError | undefined,
	report: DefinedError,
	record: DocumentedError
): CacheError {
	const isDataDefined = oldData !== undefined;

	const reports = isDataDefined ? [...oldData.reports, report] : [report];
	const records = isDataDefined ? [...oldData.records, record] : [record];

	return { reports, records };
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

export function cacheSetError(report: DefinedError, records: DocumentedError) {
	const getData = cacheGetError();

	const setData = buildCacheData(getData, report, records);

	const setTTL = buildCacheTTL({ hours: 24, minutes: 0, seconds: 0 });

	return nodeCache.set('error', setData, setTTL);
}
