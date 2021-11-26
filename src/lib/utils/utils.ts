import { goto } from '$app/navigation';

export function sanitizeRateValue(rate: string): number {
	// Remove the $ sign before returning it.
	if (!rate) return;
	rate = rate.substring(1);
	return parseInt(rate);
}

export function formatBillableTime(hours: number, minutes: number): number {
	const str = `${hours}.${minutes}`;
	return parseFloat(str);
}

export function redirectLogin(): void {
	goto(`/`);
}
