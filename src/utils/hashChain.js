/*
 * Browser implementation of the event hash chain.
 * MUST produce identical output to server/utils/hashChain.js.
 *
 * hash(n) = SHA-256( prevHash | shipmentId | version | eventType | timestampISO | canonicalPayload )
 */

export const GENESIS_HASH = "0".repeat(64);

export const stableStringify = (value) => {
  if (value === null || value === undefined || typeof value !== "object") {
    return JSON.stringify(value === undefined ? null : value);
  }

  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(",")}]`;
  }

  const keys = Object.keys(value)
    .filter((key) => value[key] !== undefined)
    .sort();

  return `{${keys
    .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`)
    .join(",")}}`;
};

const canonicalEvent = (event, prevHash) =>
  [
    prevHash,
    event.shipmentId,
    event.version,
    event.eventType,
    new Date(event.timestamp).toISOString(),
    stableStringify(event.payload || {}),
  ].join("|");

const sha256Hex = async (text) => {
  const bytes = new TextEncoder().encode(text);
  const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes);

  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};

export const buildHashChain = async (events) => {
  const ordered = [...events].sort((a, b) => a.version - b.version);
  const chain = [];
  let prevHash = GENESIS_HASH;

  for (const event of ordered) {
    const hash = await sha256Hex(canonicalEvent(event, prevHash));

    chain.push({
      version: event.version,
      eventType: event.eventType,
      timestamp: new Date(event.timestamp).toISOString(),
      prevHash,
      hash,
    });

    prevHash = hash;
  }

  return {
    algorithm: "SHA-256",
    genesis: GENESIS_HASH,
    headHash: prevHash,
    chain,
  };
};

export const shortHash = (hash = "") =>
  hash ? `${hash.slice(0, 10)}…${hash.slice(-6)}` : "—";
