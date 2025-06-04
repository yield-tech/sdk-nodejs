[*← Return to index*](../index.md)

Order module
============

**Endpoints:**
- ![query](https://img.shields.io/badge/QUERY-green) [`fetch(id)`](#-fetchid)
- ![command](https://img.shields.io/badge/COMMAND-orange) [`create(params)`](#-createparams)

**Objects:**
- [`Order`](#order)
- [`OrderStatus`](#orderstatus)
- [`OrderCustomerInfo`](#ordercustomerinfo)


Endpoints
---------

### ![query](https://img.shields.io/badge/QUERY-green) `fetch(id)`

Provides information about the order specified.

```js
let order = await client.order.fetch(id);
```

**Returns:** [Order](#order)

**Parameters:**

- `id`: `string` — The ID of the order.


### ![command](https://img.shields.io/badge/COMMAND-orange) `create(params)`

Creates a new order.

```js
let params = { field: value, ... };
let order = await client.order.create(params);
```

**Returns:** [`Order`](#order) — The newly created order.

**Parameters:**

- `params`: `object` — See the fields right below.

| Field         | Required? | Type        | Description                                                                    |
| ------------- | --------- | ----------- | ------------------------------------------------------------------------------ |
| `customerID`  | Required* | `string`    | The (Yield) customer ID that this order will belong to.                        |
| `totalAmount` | Required  | `MoneyLike` | The total amount of the order.                                                 |
| `note`        | Required* | `string`    | A note shown to the customer during checkout, such as details about the order. |

\* These fields may become optional in a future release.


Objects
-------

### `Order`

| Field          | Type                                                | Description                                                                                    |
| -------------- | --------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `id`           | `string`                                            | The ID of the order.                                                                           |
| `orderNumber`  | `string`                                            | The order number.                                                                              |
| `status`       | [`OrderStatus`](#orderstatus)                       | The status of the order.                                                                       |
| `customer`     | [`OrderCustomerInfo`](#ordercustomerinfo) \| `null` | The customer this order belongs to.                                                            |
| `date`         | `PlainDateCompat`                                   | The date of the order.                                                                         |
| `totalAmount`  | `Money`                                             | The total amount of the order.                                                                 |
| `note`         | `string` \| `null`                                  | A note shown to the customer during checkout, such as details about the order.                 |
| `paymentLink`  | `string` \| `null`                                  | The payment link for the customer to confirm this order. May be `null` if no longer available. |
| `creationTime` | `InstantCompat`                                     | The timestamp when this order was created.                                                     |


### `OrderStatus`

| Value         | Description                                                                             |
| ------------- | --------------------------------------------------------------------------------------- |
| `"PENDING"`   | The initial status for newly created orders. The customer has yet to confirm the order. |
| `"CONFIRMED"` | The customer has confirmed the order.                                                   |
| `"FULFILLED"` | The order has been marked as fulfilled.                                                 |
| `"CANCELLED"` | The order has been cancelled.                                                           |


### `OrderCustomerInfo`

| Field            | Type               | Description                                   |
| ---------------- | ------------------ | --------------------------------------------- |
| `id`             | `string`           | The ID of the customer.                       |
| `registeredName` | `string`           | The official registered name of the customer. |
| `tradeName`      | `string` \| `null` | The trade name of the customer.               |
| `customerCode`   | `string` \| `null` | The customer code assigned to this customer.  |
