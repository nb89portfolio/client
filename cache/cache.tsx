import NodeCache from 'node-cache';

type CacheTTL = {
	seconds: number;
	minutes: number;
	hours: number;
};

export function buildCacheTTL(time: CacheTTL): number {
    const { hours, minutes, seconds } = time;
    
	const hourMinutes = hours * 60;
	const hourSeconds = hourMinutes * 60;
	const minuteSeconds = minutes * 60;

	return seconds + minuteSeconds + hourSeconds;
}

const nodeCache = new NodeCache();

export default nodeCache;
