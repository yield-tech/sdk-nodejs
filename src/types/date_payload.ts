import { formatDateISO } from "../utils/date_utils.ts";

/** String must be in "YYYY-MM-DD" format. */
export type DateLike = string | Date | { year: number, month: number, day: number };

export function DatePayload(date: DateLike) {
    if (typeof date === "string") {
        return date;
    } else if (date instanceof Date) {
        return date.toISOString().split("T")[0];
    } else {
        return formatDateISO(date.year, date.month, date.day);
    }
}
