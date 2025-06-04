import { InstantCompat } from "../../types/instant_compat.ts";
import { Money } from "../../types/money.ts";
import { MoneyLike, MoneyPayload } from "../../types/money_payload.ts";
import { PlainDateCompat } from "../../types/plain_date_compat.ts";
import * as t from "../../utils/type_utils.ts";

export type OrderStatus = "PENDING" | "CONFIRMED" | "FULFILLED" | "CANCELLED";

const ORDER_STATUS_VARIANTS: OrderStatus[] = ["PENDING", "CONFIRMED", "FULFILLED", "CANCELLED"];

export class Order {
    constructor(
        public readonly id: string,
        public readonly orderNumber: string,
        public readonly status: OrderStatus,
        public readonly customer: OrderCustomerInfo | null,
        public readonly date: PlainDateCompat,
        public readonly totalAmount: Money,
        public readonly note: string | null,
        public readonly paymentLink: string | null,
        public readonly creationTime: InstantCompat,
    ) {}

    public static fromPayload(payload: Record<string, unknown>): Order {
        return new Order(
            t.expectString(payload["id"]),
            t.expectString(payload["order_number"]),
            t.expectVariant(ORDER_STATUS_VARIANTS, payload["status"]),
            payload["customer"] == null ? null : OrderCustomerInfo.fromPayload(t.expectRecord(payload["customer"])),
            PlainDateCompat.fromPayload(t.expectString(payload["date"])),
            Money.fromPayload(t.expectString(payload["total_amount"])),
            payload["note"] == null ? null : t.expectString(payload["note"]),
            payload["payment_link"] == null ? null : t.expectString(payload["payment_link"]),
            InstantCompat.fromPayload(t.expectString(payload["creation_time"])),
        );
    }
}

export class OrderCustomerInfo {
    constructor(
        public readonly id: string,
        public readonly registeredName: string,
        public readonly tradeName: string | null,
        public readonly customerCode: string | null,
    ) {}

    public static fromPayload(payload: Record<string, unknown>): OrderCustomerInfo {
        return new OrderCustomerInfo(
            t.expectString(payload["id"]),
            t.expectString(payload["registered_name"]),
            payload["trade_name"] == null ? null : t.expectString(payload["trade_name"]),
            payload["customer_code"] == null ? null : t.expectString(payload["customer_code"]),
        );
    }
}

export interface OrderCreateParams {
    customerID: string,
    totalAmount: MoneyLike,
    note?: string | null,
}

export function OrderCreatePayload(params: OrderCreateParams) {
    return {
        "customer_id": params.customerID,
        "total_amount": MoneyPayload(params.totalAmount),
        "note": params.note,
    };
}
