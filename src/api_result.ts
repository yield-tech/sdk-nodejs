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
        public readonly exception: Error | null,
    ) {
        this.error = { type, body, exception };
    }

    public get data(): never {
        throw new APIError(this.statusCode, this.requestID, this.error);
    }
}

export interface APIErrorDetails {
    readonly type: string,
    readonly body: Record<string, unknown> | null,
    readonly exception: Error | null,
}

export class APIError extends Error {
    constructor(
        public readonly statusCode: number,
        public readonly requestID: string | null,
        public readonly details: APIErrorDetails,
    ) {
        let errorInfo = details.type;

        if (details.type === "validation_error" && details.body != null) {
            let issues = JSON.stringify(details.body["issues"]);
            errorInfo = `${errorInfo} ${issues}`;
        }

        if (details.exception != null) {
            let message = JSON.stringify(details.exception.message);
            errorInfo = `${errorInfo} ${message}`;
        }

        let extraInfo = [
            `status_code=${statusCode}`,
            `request_id=${requestID ?? "<none>"}`,
        ].join("; ");

        let errorOptions = details.exception == null ? {} : { cause: details.exception };
        super(`Yield API error: ${errorInfo} [${extraInfo}]`, errorOptions);
    }
}
