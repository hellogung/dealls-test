import { toZonedTime } from "date-fns-tz";

/**
 * Convert Date (UTC) ke timezone tertentu.
 * @param date - Date object (default: sekarang/new Date())
 * @param timeZone - Timezone target (default: 'Asia/Jakarta')
 * @returns Date object yang sudah dikonversi ke timezone target
 */
export function convertToTimeZone(date: Date, timeZone: string = 'Asia/Jakarta'): Date {
    const jakartaDate = new Date(date.getTime() + (7 * 60 * 60 * 1000))
    return toZonedTime(jakartaDate, timeZone);
}

export function toTimeZoneIndonesia(date: Date): Date {
    return new Date(date.getTime() + (7 * 60 * 60 * 1000))
}