import { webcrypto } from "node:crypto";

import { FetchLike, ResponseLike } from "./fetch.ts";
import { getClientVersion } from "./version.ts";
import * as t from "./utils/type_utils.ts";
import { APIResult, APIResultFailure, APIResultSuccess } from "./api_result.ts";

export interface ClientOptions {
    baseURL?: string,
    fetch?: FetchLike,
}

export class APIClient {
    private static readonly textEncoder = new TextEncoder();

    private constructor(
        private readonly baseURL: string,
        private readonly apiKeyToken: string,
        private readonly apiKeyHMACKey: webcrypto.CryptoKey,
        private readonly fetch: FetchLike,
        private readonly clientVersion: string,
    ) {}

    public static async create(apiKey: string, options: ClientOptions = {}): Promise<APIClient> {
        let baseURL = options.baseURL ?? "https://integrate.withyield.com/api/v1";
        let [apiKeyToken, apiKeyHMACKey] = await APIClient.extractAPIKey(apiKey);
        let fetch = options.fetch ?? await APIClient.findFetch();
        let clientVersion = getClientVersion();

        return new APIClient(baseURL, apiKeyToken, apiKeyHMACKey, fetch, clientVersion);
    }

    public static async extractAPIKey(key: string): Promise<[string, webcrypto.CryptoKey]> {
        // "$" is the old separator, supported for backwards compatibility
        let keyParts = key.replaceAll("$", ":").split(":");
        if (keyParts.length !== 3) {
            throw new Error("Invalid Yield API key");
        }

        let [keyID, keySecret, hmacKeyB64] = keyParts;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        let token = `${keyID!}$${keySecret!}`;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        let hmacKeyBytes = new Uint8Array(Buffer.from(hmacKeyB64!, "base64url"));
        let hmacAlgo = { name: "HMAC", hash: "SHA-512" };
        let hmacKey = await webcrypto.subtle.importKey("raw", hmacKeyBytes, hmacAlgo, false, ["sign"]);

        return [token, hmacKey];
    }

    public static async findFetch(): Promise<FetchLike> {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (globalThis.fetch != null) {
            return globalThis.fetch;
        }

        try {
            return (await import("node-fetch")).default;
        } catch (e) {
            throw new Error("Could not find `fetch`. Try installing `node-fetch`.");
        }
    }

    public static async buildSignature(hmacKey: webcrypto.CryptoKey, timestamp: string, path: string, body: string | null = null): Promise<string> {
        let parts = body == null ? [timestamp, path] : [timestamp, path, body];
        let message = APIClient.textEncoder.encode(parts.join("\n"));
        let sigBytes = await webcrypto.subtle.sign("HMAC", hmacKey, message);
        return Buffer.from(sigBytes).toString("base64url");
    }

    public static async processResponse<T>(response: ResponseLike, fromPayload: (payload: Record<string, unknown>) => T): Promise<APIResult<T>> {
        let statusCode = response.status;
        let requestID = response.headers.get("X-Request-Id");

        if (!response.ok) {
            let errorType = "unexpected_error";
            let body = null;
            try {
                body = t.expectRecord(await response.json());
                if (typeof body["error"] === "string") {
                    errorType = body["error"];
                }
            } catch {
                // ignore
            }

            return new APIResultFailure(statusCode, requestID, errorType, body, null);
        }

        let data;
        try {
            data = fromPayload(t.expectRecord(await response.json()));
        } catch (e) {
            if (!(e instanceof Error)) {
                throw e;
            }

            return new APIResultFailure(statusCode, requestID, "invalid_response", null, e);
        }

        return new APIResultSuccess(statusCode, requestID, data);
    }

    private static buildQueryString(params: Record<string, string | number | null | undefined>): string {
        let queryParams = new URLSearchParams();
        for (let [k, v] of Object.entries(params)) {
            if (v != null) {
                queryParams.set(k, v.toString());
            }
        }

        return queryParams.toString();
    }

    public async runQuery(path: string, params: Record<string, string | number | null | undefined> | null = null): Promise<ResponseLike> {
        let fullPath = path;
        if (params != null) {
            let queryString = APIClient.buildQueryString(params);
            if (queryString !== "") {
                fullPath += "?" + queryString;
            }
        }

        return await this.callEndpoint("GET", fullPath, null);
    }

    public async runCommand(path: string, payload: unknown): Promise<ResponseLike> {
        return await this.callEndpoint("POST", path, payload);
    }

    private async callEndpoint(method: "GET" | "POST", path: string, payload: unknown): Promise<ResponseLike> {
        let headers: Record<string, string> = { "X-Yield-Client": this.clientVersion };

        let body = payload == null ? null : JSON.stringify(payload);
        if (body != null) {
            headers["Content-Type"] = "application/json";
        }

        let timestamp = new Date().toISOString().replace(/\.\d+Z$/, "Z");
        let signature = await APIClient.buildSignature(this.apiKeyHMACKey, timestamp, path, body);
        headers["Authorization"] = `Yield-Sig ${this.apiKeyToken}$${timestamp}$${signature}`;

        return await this.fetch(this.baseURL + path, { method, headers, body });
    }
}
