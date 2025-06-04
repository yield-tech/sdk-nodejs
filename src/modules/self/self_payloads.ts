import * as t from "../../utils/type_utils.ts";

export class SelfInfo {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly organization: SelfOrganizationInfo,
    ) {}

    public static fromPayload(payload: Record<string, unknown>): SelfInfo {
        return new SelfInfo(
            t.expectString(payload["id"]),
            t.expectString(payload["name"]),
            SelfOrganizationInfo.fromPayload(t.expectRecord(payload["organization"])),
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
            t.expectString(payload["id"]),
            t.expectString(payload["registered_name"]),
            payload["trade_name"] == null ? null : t.expectString(payload["trade_name"]),
        );
    }
}
