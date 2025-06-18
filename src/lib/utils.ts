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

type MonthParams =
    | { year: number; month: number } // both must be provided
    | { year?: never; month?: number } // only month
    | { year?: never; month?: never }; // none provided

export function countWeekdaysInCurrentMonth(params: MonthParams = {}): number {
    const today = new Date()
    const year = params.year ?? today.getFullYear()
    const month = params.month ?? today.getMonth() // 0-based: Januari = 0

    let weekdayCount = 0
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    for (let day = 1; day <= daysInMonth; day++) {
        const current = new Date(year, month, day)
        const dayOfWeek = current.getDay() // 0 = Minggu, 1 = Senin, ..., 6 = Sabtu
        if (dayOfWeek >= 1 && dayOfWeek <= 5) {
            weekdayCount++
        }
    }

    return weekdayCount
}
