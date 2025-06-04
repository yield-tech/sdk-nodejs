export function expectBoolean(data: unknown): boolean {
    if (typeof data !== "boolean") {
        // eslint-disable-next-line eqeqeq
        throw new TypeError(`Expected boolean, got ${data === null ? "null" : typeof data}`);
    }

    return data;
}

export function expectInteger(data: unknown): number {
    if (typeof data !== "number") {
        // eslint-disable-next-line eqeqeq
        throw new TypeError(`Expected number, got ${data === null ? "null" : typeof data}`);
    }

    if (!Number.isSafeInteger(data)) {
        throw new Error(`Invalid integer: "${data}"`);
    }

    return data;
}

export function expectString(data: unknown): string {
    if (typeof data !== "string") {
        // eslint-disable-next-line eqeqeq
        throw new TypeError(`Expected string, got ${data === null ? "null" : typeof data}`);
    }

    return data;
}

export function expectVariant<S extends string>(variants: readonly S[], data: unknown): S {
    if (typeof data !== "string") {
        // eslint-disable-next-line eqeqeq
        throw new TypeError(`Expected string, got ${data === null ? "null" : typeof data}`);
    }

    if (!variants.includes(data as S)) {
        throw new Error(`Invalid variant: "${data}"`);
    }

    return data as S;
}

export function expectRecord(data: unknown): Record<string, unknown> {
    if (typeof data !== "object") {
        throw new TypeError(`Expected object, got ${typeof data}`);
    }

    if (data == null) {
        throw new TypeError("Expected object, got null");
    }

    if (Array.isArray(data)) {
        throw new TypeError(`Expected non-array object, got Array`);
    }

    return data as Record<string, unknown>;
}

export function expectList(data: unknown): unknown[] {
    if (!Array.isArray(data)) {
        // eslint-disable-next-line eqeqeq
        throw new TypeError(`Expected array, got ${data === null ? "null" : typeof data}`);
    }

    return data;
}

export function expectRecordList(data: unknown): Record<string, unknown>[] {
    return expectList(data).map(expectRecord);
}
