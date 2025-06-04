import { Page } from "./page.ts";

export type CursorLike = string | { id: string } | Page<{ id: string }>;

export function CursorPayload(cursor: CursorLike) {
    if (typeof cursor === "string") {
        return cursor;
    } else if (cursor instanceof Page) {
        return cursor.at(-1)?.id;
    } else {
        return cursor.id;
    }
}
