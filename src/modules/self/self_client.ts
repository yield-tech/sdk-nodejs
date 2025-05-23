import { APIClient, APIResult } from "../../api_client.ts";
import { SelfInfo } from "./self_payloads.ts";

export class SelfClient {
    constructor(
        private readonly base: SelfBaseClient,
    ) {}

    public async info(): Promise<SelfInfo> {
        return (await this.base.info()).data;
    }
}

export class SelfBaseClient {
    constructor(
        private readonly api: APIClient,
    ) {}

    public async info(): Promise<APIResult<SelfInfo>> {
        let response = await this.api.runQuery("/self/info");

        return await APIClient.processResponse(response, SelfInfo.fromPayload);
    }
}
