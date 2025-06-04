/** String must be in "{currency_code} {amount}" format (e.g. "PHP 1234.50"). */
export type MoneyLike = string | [string, string | DecimalCompat] | { currencyCode: string, value: string };

/** Designed to be compatible with MikeMcl's decimal libraries (big.js, decimal.js, bignumber.js) */
export interface DecimalCompat {
    // Ideally `DecimalLike` and `never` should reference the actual implementing class,
    // but it doesn't seem possible to express this cleanly in TypeScript.
    abs(): DecimalCompat,
    eq(_: never): boolean,
    plus(_: never): DecimalCompat,
    toString(): string,
}

export function MoneyPayload(money: MoneyLike) {
    if (typeof money === "string") {
        return money;
    } else if (Array.isArray(money)) {
        return `${money[0]} ${money[1].toString()}`;
    } else {
        return `${money.currencyCode} ${money.value}`;
    }
}
