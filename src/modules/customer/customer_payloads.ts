import { CursorLike, CursorPayload } from "../../types/cursor_payload.ts";
import { Money } from "../../types/money.ts";
import * as t from "../../utils/type_utils.ts";

export class CustomerRow {
    constructor(
        public readonly id: string,
        public readonly registeredName: string,
        public readonly tradeName: string | null,
        public readonly customerCode: string | null,
        public readonly creditLine: CustomerCreditLineInfo | null,
    ) {}

    public static fromPayload(payload: Record<string, unknown>): CustomerRow {
        return new CustomerRow(
            t.expectString(payload["id"]),
            t.expectString(payload["registered_name"]),
            payload["trade_name"] == null ? null : t.expectString(payload["trade_name"]),
            payload["customer_code"] == null ? null : t.expectString(payload["customer_code"]),
            payload["credit_line"] == null ? null : CustomerCreditLineInfo.fromPayload(t.expectRecord(payload["credit_line"])),
        );
    }
}

export class CustomerCreditLineInfo {
    constructor(
        public readonly creditLimit: Money,
        public readonly amountAvailable: Money,
    ) {}

    public static fromPayload(payload: Record<string, unknown>): CustomerCreditLineInfo {
        return new CustomerCreditLineInfo(
            Money.fromPayload(t.expectString(payload["credit_limit"])),
            Money.fromPayload(t.expectString(payload["amount_available"])),
        );
    }
}

export interface CustomerListParams {
    limit?: number | null,
    after?: CursorLike | null,
    customerCode?: string | null,
    extraSystemID?: string | null,
}

export function CustomerListPayload(params: CustomerListParams) {
    return {
        "limit": params.limit,
        "after": params.after == null ? null : CursorPayload(params.after),
        "customer_code": params.customerCode,
        "extra_system_id": params.extraSystemID,
    };
}
