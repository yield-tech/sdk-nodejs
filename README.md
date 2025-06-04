Yield SDK for Node.js [![NPM Version](https://img.shields.io/npm/v/%40yield-tech%2Fsdk-nodejs)](https://www.npmjs.com/package/@yield-tech/sdk-nodejs)
=====================

The official [Yield](https://www.paywithyield.com) SDK for Node.js.


Documentation
-------------

- [API reference](https://github.com/yield-tech/sdk-nodejs/blob/main/docs/index.md)


Installation
------------

```sh
npm install @yield-tech/sdk-nodejs
```


Usage
-----

```js
import * as YieldSDK from "@yield-tech/sdk-nodejs";

// For security, don't save the actual key in your code or repo
let client = await YieldSDK.Client.create(process.env["YIELD_API_KEY"]);

// Fetch an existing order
let order = await client.order.fetch("ord_...");
console.log(order.customer.registeredName);

// Or create a new one
let newOrder = await client.order.create({
    customerID: "org_...",
    totalAmount: "PHP 1234.50",
    note: "Test order from the NodeJS SDK!",
});
```

For more details, check out our [API reference](https://github.com/yield-tech/sdk-nodejs/blob/main/docs/index.md).
