import { formatDateISO } from "./utils.ts";

/** Designed to be compatible with the upcoming Temporal type (iso8601 only). */
export class PlainDateLike {
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
            throw new Error(`Invalid date: ${s}`);
        }

        return new PlainDateLike(Number(match[1]), Number(match[2]), Number(match[3]));
    }

    public toString() {
        return formatDateISO(this.year, this.month, this.day);
    }
}

/** Designed to be compatible with the upcoming Temporal type (iso8601 only). */
export class InstantLike {
    constructor(
        public epochMilliseconds: number,
    ) {}

    public static fromPayload(s: string) {
        return new InstantLike(Date.parse(s));
    }

    public toString(instant: InstantLike) {
        return new Date(instant.epochMilliseconds).toISOString();
    }
}

export class Money {
    constructor(
        /** ISO currency code, e.g. "USD", "PHP" */
        public readonly currencyCode: string,
        /** The amount, e.g. "1234.50" */
        public readonly value: string,
    ) {}

    public static fromPayload(s: string) {
        let match = /^([A-Z]{3}) (-?\d+(\.\d+)?)$/.exec(s);
        if (match == null) {
            throw new Error(`Invalid money: ${s}`);
        }

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return new Money(match[1]!, match[2]!);
    }

    public toString() {
        return `${this.currencyCode} ${this.value}`;
    }
}

/** String must be in "YYYY-MM-DD" format. */
export type IntoDatePayload = string | Date | { year: number, month: number, day: number };

export function DatePayload(date: IntoDatePayload) {
    if (typeof date === "string") {
        return date;
    } else if (date instanceof Date) {
        return date.toISOString().split("T")[0];
    } else {
        return formatDateISO(date.year, date.month, date.day);
    }
}

/** String must be in "{currency_code} {amount}" format (e.g. "PHP 1234.50"). */
export type IntoMoneyPayload = string | { currencyCode: string, value: string };

export function MoneyPayload(money: IntoMoneyPayload) {
    if (typeof money === "string") {
        return money;
    } else {
        return `${money.currencyCode} ${money.value}`;
    }
}
