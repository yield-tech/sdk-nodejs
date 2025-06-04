import * as t from "../utils/type_utils.ts";

export class Page<T> {
    constructor(
        private readonly items: T[],
        public readonly hasMore: boolean,
    ) {}

    public static buildWith<E>(fromPayload: (payload: Record<string, unknown>) => E): (payload: Record<string, unknown>) => Page<E> {
        return function (payload: Record<string, unknown>) {
            return new Page(
                t.expectRecordList(payload["items"]).map(fromPayload),
                t.expectBoolean(payload["has_more"]),
            );
        };
    }

    public toArray() {
        return this.items.slice();
    }

    public get length() {
        return this.items.length;
    }

    public [Symbol.iterator]() {
        return this.items[Symbol.iterator]();
    }

    public at(index: number) {
        return this.items.at(index);
    }

    public entries() {
        return this.items.entries();
    }

    public find(predicate: (value: T, index: number, obj: T[]) => boolean): T | undefined {
        return this.items.find(predicate);
    }

    public findIndex(predicate: (value: T, index: number, obj: T[]) => boolean): number {
        return this.items.findIndex(predicate);
    }

    public map<U>(func: (value: T, index: number, array: T[]) => U): U[] {
        return this.items.map(func);
    }

    public flatMap<U>(func: (value: T, index: number, array: T[]) => U | readonly U[]): U[] {
        return this.items.flatMap(func);
    }

    public filter(predicate: (value: T, index: number, array: T[]) => boolean): T[] {
        return this.items.filter(predicate);
    }

    public some(predicate: (value: T, index: number, array: T[]) => boolean): boolean {
        return this.items.some(predicate);
    }

    public every(predicate: (value: T, index: number, array: T[]) => boolean): boolean {
        return this.items.every(predicate);
    }
}
