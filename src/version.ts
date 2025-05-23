export const version = "0.5.0";

const SUPPORTED_RUNTIMES = [
    "bun",
    "deno",
    // Note: Node.js must be the last one
    "node",
];

function getRuntimeVersion(): [string] | [string, string] {
    let name = "unknown";
    let majorVersion = null;

    for (let runtime of SUPPORTED_RUNTIMES) {
        let runtimeVersion = process.versions[runtime];
        if (runtimeVersion != null) {
            name = runtime;
            majorVersion = runtimeVersion.split(".")[0] ?? null;
            break;
        }
    }

    return majorVersion == null ? [name] : [name, majorVersion];
}

export function getClientVersion(): string {
    let sdkVersion = version;
    let runtimeVersion = getRuntimeVersion().join(" ");

    return `Yield-SDK-NodeJS/${sdkVersion} (${runtimeVersion})`;
}
