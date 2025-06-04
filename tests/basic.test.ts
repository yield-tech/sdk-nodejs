import assert from "node:assert/strict";
import { test } from "node:test";

import * as YieldSDK from "../src/index.ts";

const API_KEY = process.env["YIELD_API_KEY"] ?? "";
const BASE_URL = process.env["YIELD_API_BASE_URL"];

if (BASE_URL != null && BASE_URL.includes("localhost")) {
    // Skip TLS certificate verification
    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
}

void test("connection", async (_) => {
    let client = await YieldSDK.Client.create(API_KEY, { baseURL: BASE_URL });

    let info = await client.self.info();

    assert.equal(info.id, API_KEY.split(":")[0]);
});
