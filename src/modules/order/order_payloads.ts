import { assertObject, assertString, assertVariant } from "../../utils.ts";
import { InstantLike, IntoMoneyPayload, Money, MoneyPayload, PlainDateLike } from "../../types.ts";

export type OrderStatus = "PENDING" | "CONFIRMED" | "FULFILLED" | "CANCELLED";

const ORDER_STATUS_VARIANTS: OrderStatus[] = ["PENDING", "CONFIRMED", "FULFILLED", "CANCELLED"];

export class Order {
    constructor(
        public readonly id: string,
        public readonly orderNumber: string,
        public readonly status: OrderStatus,
        public readonly customer: OrderCustomerInfo | null,
        public readonly date: PlainDateLike,
        public readonly totalAmount: Money,
        public readonly note: string | null,
        public readonly paymentLink: string | null,
        public readonly creationTime: InstantLike,
    ) {}

    public static fromPayload(payload: Record<string, unknown>): Order {
        return new Order(
            assertString(payload["id"]),
            assertString(payload["order_number"]),
            assertVariant(ORDER_STATUS_VARIANTS, payload["status"]),
            payload["customer"] == null ? null : OrderCustomerInfo.fromPayload(assertObject(payload["customer"])),
            PlainDateLike.fromPayload(assertString(payload["date"])),
            Money.fromPayload(assertString(payload["total_amount"])),
            payload["note"] == null ? null : assertString(payload["note"]),
            payload["payment_link"] == null ? null : assertString(payload["payment_link"]),
            InstantLike.fromPayload(assertString(payload["creation_time"])),
        );
    }
}

export class OrderCustomerInfo {
    constructor(
        public readonly id: string,
        public readonly registeredName: string,
        public readonly tradeName: string | null,
    ) {}

    public static fromPayload(payload: Record<string, unknown>): OrderCustomerInfo {
        return new OrderCustomerInfo(
            assertString(payload["id"]),
            assertString(payload["registered_name"]),
            payload["trade_name"] == null ? null : assertString(payload["trade_name"]),
        );
    }
}

export interface OrderCreateParams {
    customerID: string,
    totalAmount: IntoMoneyPayload,
    note?: string | null,
}

export function OrderCreatePayload(params: OrderCreateParams) {
    return {
        "customer_id": params.customerID,
        "total_amount": MoneyPayload(params.totalAmount),
        "note": params.note,
    };
};
