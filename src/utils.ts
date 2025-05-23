export function assertBoolean(data: unknown): boolean {
    if (typeof data !== "boolean") {
        throw new Error(`Expected boolean, got ${typeof data}`);
    }

    return data;
}

export function assertInteger(data: unknown): number {
    if (typeof data !== "number" || !Number.isSafeInteger(data)) {
        throw new Error(`Expected integer, got ${typeof data}`);
    }

    return data;
}

export function assertString(data: unknown): string {
    if (typeof data !== "string") {
        throw new Error(`Expected string, got ${typeof data}`);
    }

    return data;
}

export function assertObject(data: unknown): Record<string, unknown> {
    if (data == null) {
        throw new Error("Expected object, got null");
    }

    if (typeof data !== "object") {
        throw new Error(`Expected object, got ${typeof data}`);
    }

    return data as Record<string, unknown>;
}

export function assertVariant<S extends string>(variants: readonly S[], data: unknown): S {
    let s = assertString(data);
    if (!variants.includes(s as S)) {
        throw new Error(`Invalid variant: "${s}"`);
    }

    return s as S;
}

export function formatDateISO(year: number, month: number, day: number) {
    let yyyy = year.toString().padStart(4, "0");
    let mm = month.toString().padStart(2, "0");
    let dd = day.toString().padStart(2, "0");

    return `${yyyy}-${mm}-${dd}`;
}
