export interface HTTPClient {
    fetch(url: string, init?: RequestInitLike): Promise<ResponseLike>,
}

export interface RequestInitLike {
    method?: string,
    headers?: Record<string, string>,
    body?: string | FormData | null,
    signal?: AbortSignal,
}

export interface ResponseLike {
    readonly ok: boolean,
    readonly status: number,

    readonly url: string,
    readonly headers: HeadersLike,

    text(): Promise<string>,
    json(): Promise<unknown>,
}

export interface HeadersLike {
    get(name: string): string | null,
}

export class FetchHTTPClient implements HTTPClient {
    constructor(
        public fetch: (url: string, init?: RequestInitLike) => Promise<ResponseLike>,
    ) {}
}
