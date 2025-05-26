import { webcrypto } from "node:crypto";

import { FetchHTTPClient, HTTPClient, ResponseLike } from "./http_client.ts";
import { getClientVersion } from "./version.ts";
import { assertObject } from "./utils.ts";

export interface ClientOptions {
    baseURL?: string,
    httpClient?: HTTPClient,
}

export interface APIKey {
    readonly token: string,
    readonly hmacKey: webcrypto.CryptoKey,
}

export class APIClient {
    private static readonly textEncoder = new TextEncoder();

    private constructor(
        private readonly baseURL: string,
        private readonly apiKey: APIKey,
        private readonly http: HTTPClient,
        private readonly clientVersion: string,
    ) {}

    public static async create(apiKeyString: string, options: ClientOptions = {}): Promise<APIClient> {
        let apiKeyParts = apiKeyString.split("$");
        if (apiKeyParts.length !== 3) {
            throw new Error("Invalid Yield API key");
        }

        let [keyID, keySecret, hmacKeyB64] = apiKeyParts;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        let token = `${keyID!}$${keySecret!}`;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        let hmacKeyBytes = new Uint8Array(Buffer.from(hmacKeyB64!, "base64url"));
        let hmacAlgo = { name: "HMAC", hash: "SHA-512" };
        let hmacKey = await webcrypto.subtle.importKey("raw", hmacKeyBytes, hmacAlgo, false, ["sign"]);
        let apiKey = { token, hmacKey };

        let baseURL = options.baseURL ?? "https://integrate.withyield.com/api/v1";
        let httpClient = options.httpClient ?? await APIClient.defaultHTTPClient();

        return new APIClient(
            baseURL,
            apiKey,
            httpClient,
            getClientVersion(),
        );
    }

    public static async defaultHTTPClient(): Promise<HTTPClient> {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (globalThis.fetch != null) {
            return new FetchHTTPClient(globalThis.fetch);
        }

        try {
            return new FetchHTTPClient((await import("node-fetch")).default);
        } catch (e) {
            throw new Error("No HTTP client found. Please install `node-fetch` or provide your own HTTP client.");
        }
    }

    public static async processResponse<T>(response: ResponseLike, fromPayload: (payload: Record<string, unknown>) => T): Promise<APIResult<T>> {
        let statusCode = response.status;
        let requestID = response.headers.get("X-Request-Id");

        if (!response.ok) {
            let errorType = "unexpected_error";
            let body = null;
            try {
                body = assertObject(await response.json());
                if (typeof body["error"] === "string") {
                    errorType = body["error"];
                }
            } catch {
                // ignore
            }

            return new APIResultFailure(statusCode, requestID, errorType, body);
        }

        let data;
        try {
            data = fromPayload(assertObject(await response.json()));
        } catch {
            return new APIResultFailure(statusCode, requestID, "unexpected_payload", null);
        }

        return new APIResultSuccess(statusCode, requestID, data);
    }

    public async runQuery(path: string, params: URLSearchParams | null = null): Promise<ResponseLike> {
        let fullPath = path;
        if (params != null) {
            fullPath += "?" + params.toString();
        }

        return await this.callEndpoint("GET", fullPath, null);
    }

    public async runCommand(path: string, payload: unknown): Promise<ResponseLike> {
        return await this.callEndpoint("POST", path, payload);
    }

    public async buildSignature(path: string, body: string | null = null, now = new Date()): Promise<string> {
        let timestamp = now.toISOString().replace(/\.\d+Z$/, "Z");

        let parts = body == null ? [timestamp, path] : [timestamp, path, body];
        let message = APIClient.textEncoder.encode(parts.join("\n"));
        let signatureBytes = await webcrypto.subtle.sign("HMAC", this.apiKey.hmacKey, message);
        let signatureB64 = Buffer.from(signatureBytes).toString("base64url");

        return [this.apiKey.token, timestamp, signatureB64].join("$");
    }

    private async callEndpoint(method: "GET" | "POST", path: string, payload: unknown): Promise<ResponseLike> {
        let headers: Record<string, string> = { "X-Yield-Client": this.clientVersion };

        let body = payload == null ? null : JSON.stringify(payload);
        if (body != null) {
            headers["Content-Type"] = "application/json";
        }

        let signature = await this.buildSignature(path, body);
        headers["Authorization"] = `Yield-Sig ${signature}`;

        return await this.http.fetch(this.baseURL + path, { method, headers, body });
    }
}

export type APIResult<T> = APIResultSuccess<T> | APIResultFailure;

export class APIResultSuccess<T> {
    public readonly ok = true as const;
    public readonly error: null = null;

    constructor(
        public readonly statusCode: number,
        public readonly requestID: string | null,
        public readonly data: T,
    ) {}
}

export class APIResultFailure {
    public readonly ok = false as const;
    public readonly error: APIErrorDetails;

    constructor(
        public readonly statusCode: number,
        public readonly requestID: string | null,
        public readonly type: string,
        public readonly body: Record<string, unknown> | null,
    ) {
        this.error = { type, body };
    }

    public get data(): never {
        throw new APIError(this);
    }
}

export interface APIErrorDetails {
    readonly type: string,
    readonly body: Record<string, unknown> | null,
}

export class APIError extends Error {
    constructor(
        public readonly result: APIResultFailure,
    ) {
        let message = [result.error.type];

        if (result.error.type === "validation_error" && result.error.body != null) {
            message.push(JSON.stringify(result.error.body["issues"]));
        }

        let extraFields: [string, unknown][] = [
            ["status_code", result.statusCode],
            ["request_id", result.requestID],
        ];
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        let extraData = extraFields.filter(([_, v]) => v != null).map(([k, v]) => `${k}=${v}`).join("; ");
        message.push(`[${extraData}]`);

        super(`Yield API error: ${message.join(" ")}`);
    }
}
