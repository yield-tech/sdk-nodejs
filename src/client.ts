import { APIClient, ClientOptions } from "./api_client.ts";
import { OrderBaseClient, OrderClient } from "./modules/order/order_client.ts";
import { SelfBaseClient, SelfClient } from "./modules/self/self_client.ts";

export class Client {
    public readonly self: SelfClient;
    public readonly order: OrderClient;

    private constructor(public readonly base: BaseClient) {
        this.self = new SelfClient(this.base.self);
        this.order = new OrderClient(this.base.order);
    }

    public static async create(apiKey: string, options: ClientOptions = {}): Promise<Client> {
        return new Client(await BaseClient.create(apiKey, options));
    }
}

export class BaseClient {
    public readonly self: SelfBaseClient;
    public readonly order: OrderBaseClient;

    private constructor(public readonly api: APIClient) {
        this.self = new SelfBaseClient(this.api);
        this.order = new OrderBaseClient(this.api);
    }

    public static async create(apiKey: string, options: ClientOptions = {}): Promise<BaseClient> {
        return new BaseClient(await APIClient.create(apiKey, options));
    }
}
