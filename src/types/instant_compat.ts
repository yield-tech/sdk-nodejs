/** Designed to be compatible with the upcoming Temporal type (iso8601 only). */
export class InstantCompat {
    constructor(
        public epochMilliseconds: number,
    ) {}

    public static fromPayload(s: string) {
        let match = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{1,6}Z$/.exec(s);
        if (match == null) {
            throw new Error(`Invalid time: "${s}"`);
        }

        return new InstantCompat(Date.parse(s));
    }

    public toString(instant: InstantCompat) {
        return new Date(instant.epochMilliseconds).toISOString();
    }
}
