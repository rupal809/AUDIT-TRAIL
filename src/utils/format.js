export const EVENT_META = {
  CONTAINER_CREATED: { label: "Container Created", tone: "info", icon: "📦" },
  LOADED_ON_TRUCK: { label: "Loaded on Truck", tone: "info", icon: "🚚" },
  LOADED_ON_SHIP: { label: "Loaded on Ship", tone: "info", icon: "🚢" },
  IN_TRANSIT: { label: "In Transit", tone: "info", icon: "🧭" },
  SHIPMENT_MOVED: { label: "Shipment Moved", tone: "info", icon: "➡️" },
  ARRIVED_AT_PORT: { label: "Arrived at Port", tone: "success", icon: "⚓" },
  DELIVERED: { label: "Delivered", tone: "success", icon: "✅" },
  TEMPERATURE_SPIKE: { label: "Temperature Reading", tone: "neutral", icon: "🌡️" },
};

export const MOVE_STATUSES = [
  "LOADED_ON_TRUCK",
  "LOADED_ON_SHIP",
  "IN_TRANSIT",
  "SHIPMENT_MOVED",
  "ARRIVED_AT_PORT",
  "DELIVERED",
];

export const STATUS_COLORS = {
  CREATED: "#8b5cf6",
  LOADED_ON_TRUCK: "#0ea5e9",
  LOADED_ON_SHIP: "#4d7cff",
  IN_TRANSIT: "#6366f1",
  SHIPMENT_MOVED: "#14b8a6",
  ARRIVED_AT_PORT: "#f3a73f",
  DELIVERED: "#22c983",
  UNKNOWN: "#94a3b8",
};

export const humanize = (value) =>
  value
    ? String(value)
        .toLowerCase()
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "—";

export const eventMeta = (event) => {
  const base = EVENT_META[event.eventType] || {
    label: humanize(event.eventType),
    tone: "neutral",
    icon: "•",
  };

  if (event.eventType === "TEMPERATURE_SPIKE" && event.payload?.isSpike) {
    return { ...base, label: "Temperature Spike", tone: "danger" };
  }

  return base;
};

export const describeEvent = (event) => {
  const p = event.payload || {};

  switch (event.eventType) {
    case "CONTAINER_CREATED":
      return `Registered ${p.containerType ? `${p.containerType} container ` : ""}for route ${p.origin || "?"} → ${p.destination || "?"}.`;
    case "TEMPERATURE_SPIKE": {
      const reading = `${p.temperature}°${p.unit || "C"}`;
      const limit = p.threshold !== null && p.threshold !== undefined
        ? ` (threshold ${p.threshold}°${p.unit || "C"})`
        : "";
      const sensor = p.sensorId ? ` from sensor ${p.sensorId}` : "";
      return p.isSpike
        ? `Reading ${reading}${limit}${sensor} — threshold exceeded.`
        : `Reading ${reading}${limit}${sensor}.`;
    }
    default: {
      const parts = [];
      if (p.location) parts.push(`at ${p.location}`);
      if (p.carrier) parts.push(`carrier ${p.carrier}`);
      const text = parts.length ? `${humanize(event.eventType)} ${parts.join(", ")}.` : "";
      return [text, p.notes].filter(Boolean).join(" ");
    }
  }
};

export const formatDateTime = (value) =>
  value
    ? new Date(value).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "—";

export const formatRelative = (value) => {
  if (!value) return "—";
  const diff = Date.now() - new Date(value).getTime();
  const minutes = Math.round(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days} d ago`;
  return formatDateTime(value);
};

export const SHIPMENT_ID_PATTERN = /^[A-Za-z0-9_-]{3,40}$/;

export const validateShipmentId = (value) => {
  const id = value.trim();
  if (!id) return "Please enter a Shipment ID.";
  if (!SHIPMENT_ID_PATTERN.test(id)) {
    return "Invalid Shipment ID format. Use 3–40 letters, numbers, - or _.";
  }
  return "";
};

export const downloadJson = (filename, data) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};
