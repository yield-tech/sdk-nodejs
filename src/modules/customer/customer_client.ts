import { APIClient } from "../../api_client.ts";
import { APIResult } from "../../api_result.ts";
import { Page } from "../../types/page.ts";
import { CustomerListParams, CustomerListPayload, CustomerRow } from "./customer_payloads.ts";

export class CustomerClient {
    constructor(
        private readonly base: CustomerBaseClient,
    ) {}

    public async list(params: CustomerListParams | null = null): Promise<Page<CustomerRow>> {
        return (await this.base.list(params)).data;
    }
}

export class CustomerBaseClient {
    constructor(
        private readonly api: APIClient,
    ) {}

    public async list(params: CustomerListParams | null = null): Promise<APIResult<Page<CustomerRow>>> {
        let payload = params == null ? null : CustomerListPayload(params);
        let response = await this.api.runQuery("/customer/list", payload);

        return await APIClient.processResponse(response, Page.buildWith(CustomerRow.fromPayload));
    }
}
