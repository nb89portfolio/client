import defineError from './definedError';

export default function catchFatalError(error: any): string {
	const { name, message, stack } = defineError(error);

	return `Fatal Error: Error with "${name}", with error message "${message}", and with error stack "${stack}" has caused a fatal error that cannot be reported. Please try again later.`;
}
