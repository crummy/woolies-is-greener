const NZD_TO_AUD_RATE = 0.91;

export function convertNzdToAud(amount: number): number {
    return amount * NZD_TO_AUD_RATE;
}

export function convertAudToNzd(amount: number): number {
    return amount / NZD_TO_AUD_RATE;
}
