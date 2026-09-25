const crypto = require("crypto");

/*
 * Hash chain over the event stream (tamper evidence).
 *
 * hash(n) = SHA-256( prevHash | shipmentId | version | eventType | timestampISO | canonicalPayload )
 *
 * Any edit, deletion, insertion or re-ordering of an event changes every hash
 * after it, including the head hash. The frontend recomputes the same chain in
 * the browser (src/utils/hashChain.js) and compares heads. Keep both files in sync.
 */

const GENESIS_HASH = "0".repeat(64);

const stableStringify = (value) => {
  if (value instanceof Date) {
    return JSON.stringify(value.toISOString());
  }

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

const sha256Hex = (text) =>
  crypto.createHash("sha256").update(text, "utf8").digest("hex");

const buildHashChain = (events) => {
  let prevHash = GENESIS_HASH;

  const chain = events.map((event) => {
    const hash = sha256Hex(canonicalEvent(event, prevHash));

    const link = {
      version: event.version,
      eventType: event.eventType,
      timestamp: new Date(event.timestamp).toISOString(),
      prevHash,
      hash,
    };

    prevHash = hash;
    return link;
  });

  return {
    algorithm: "SHA-256",
    genesis: GENESIS_HASH,
    headHash: prevHash,
    chain,
  };
};

module.exports = {
  GENESIS_HASH,
  stableStringify,
  canonicalEvent,
  buildHashChain,
};
