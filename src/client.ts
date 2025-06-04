import { APIClient, ClientOptions } from "./api_client.ts";
import { CustomerBaseClient, CustomerClient } from "./modules/customer/customer_client.ts";
import { OrderBaseClient, OrderClient } from "./modules/order/order_client.ts";
import { SelfBaseClient, SelfClient } from "./modules/self/self_client.ts";

export class Client {
    public readonly customer: CustomerClient;
    public readonly order: OrderClient;
    public readonly self: SelfClient;

    private constructor(public readonly base: BaseClient) {
        this.customer = new CustomerClient(this.base.customer);
        this.order = new OrderClient(this.base.order);
        this.self = new SelfClient(this.base.self);
    }

    public static async create(apiKey: string, options: ClientOptions = {}): Promise<Client> {
        return new Client(await BaseClient.create(apiKey, options));
    }
}

export class BaseClient {
    public readonly customer: CustomerBaseClient;
    public readonly order: OrderBaseClient;
    public readonly self: SelfBaseClient;

    private constructor(public readonly api: APIClient) {
        this.customer = new CustomerBaseClient(this.api);
        this.self = new SelfBaseClient(this.api);
        this.order = new OrderBaseClient(this.api);
    }

    public static async create(apiKey: string, options: ClientOptions = {}): Promise<BaseClient> {
        return new BaseClient(await APIClient.create(apiKey, options));
    }
}
