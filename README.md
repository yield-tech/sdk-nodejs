# The official Yield SDK for Node.js

## Installation

```sh
npm install @yield-tech/sdk-nodejs
```

## Usage

```js
import * as YieldSDK from "@yield-tech/sdk-nodejs";

// for security, never commit the actual key in your code
let client = await YieldSDK.Client.create(process.env["YIELD_API_KEY"]);

// fetch an existing order
let order = await client.order.fetch("ord_...");
console.log(order.customer.registeredName);

// or create a new one
let newOrder = await client.order.create({
    customerID: "org_...",
    totalAmount: "PHP 1234.50",
    note: "Test order from the NodeJS SDK!",
});
```
