import { formatDateISO } from "../utils/date_utils.ts";

/** Designed to be compatible with the upcoming Temporal type (iso8601 only). */
export class PlainDateCompat {
    constructor(
        /** The full calendar year. */
        public readonly year: number,
        /** Month from 1 (January) to 12 (December). */
        public readonly month: number,
        /** Day of the month (1-31). */
        public readonly day: number,
    ) {}

    public static fromPayload(s: string) {
        let match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
        if (match == null) {
            throw new Error(`Invalid date: "${s}"`);
        }

        return new PlainDateCompat(Number(match[1]), Number(match[2]), Number(match[3]));
    }

    public toString() {
        return formatDateISO(this.year, this.month, this.day);
    }
}
