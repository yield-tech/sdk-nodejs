import { assertObject, assertString } from "../../utils.ts";

export class SelfInfo {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly organization: SelfOrganizationInfo,
    ) {}

    public static fromPayload(payload: Record<string, unknown>): SelfInfo {
        return new SelfInfo(
            assertString(payload["id"]),
            assertString(payload["name"]),
            SelfOrganizationInfo.fromPayload(assertObject(payload["organization"])),
        );
    }
}

export class SelfOrganizationInfo {
    constructor(
        public readonly id: string,
        public readonly registeredName: string,
        public readonly tradeName: string | null,
    ) {}

    public static fromPayload(payload: Record<string, unknown>): SelfOrganizationInfo {
        return new SelfOrganizationInfo(
            assertString(payload["id"]),
            assertString(payload["registered_name"]),
            payload["trade_name"] == null ? null : assertString(payload["trade_name"]),
        );
    }
}
