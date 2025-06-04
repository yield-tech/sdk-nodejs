import { APIClient } from "../../api_client.ts";
import { APIResult } from "../../api_result.ts";
import { Order, OrderCreateParams, OrderCreatePayload } from "./order_payloads.ts";

export class OrderClient {
    constructor(
        private readonly base: OrderBaseClient,
    ) {}

    public async fetch(id: string): Promise<Order> {
        return (await this.base.fetch(id)).data;
    }

    public async create(params: OrderCreateParams): Promise<Order> {
        return (await this.base.create(params)).data;
    }
}

export class OrderBaseClient {
    constructor(
        private readonly api: APIClient,
    ) {}

    public async fetch(id: string): Promise<APIResult<Order>> {
        let encodedID = encodeURIComponent(id);
        let response = await this.api.runQuery(`/order/fetch/${encodedID}`);

        return await APIClient.processResponse(response, Order.fromPayload);
    }

    public async create(params: OrderCreateParams): Promise<APIResult<Order>> {
        let payload = OrderCreatePayload(params);
        let response = await this.api.runCommand("/order/create", payload);

        return await APIClient.processResponse(response, Order.fromPayload);
    }
}
