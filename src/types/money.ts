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
            throw new Error(`Invalid money: "${s}"`);
        }

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return new Money(match[1]!, match[2]!);
    }

    public toString() {
        return `${this.currencyCode} ${this.value}`;
    }
}
