/*
 * Frontend mirror of server/reducers/shipmentReducer.js.
 * Used for instant client-side state scrubbing (rewind slider) and mock mode.
 * The server replay (/replay/:id/state?version=N) is the source of truth —
 * the rewind panel cross-checks against it in live mode.
 */

const LOCATION_EVENTS = [
  "LOADED_ON_TRUCK",
  "LOADED_ON_SHIP",
  "IN_TRANSIT",
  "SHIPMENT_MOVED",
  "ARRIVED_AT_PORT",
  "DELIVERED",
];

export const initialShipmentState = (shipmentId) => ({
  shipmentId,
  status: "UNKNOWN",
  location: null,
  version: 0,
});

export const shipmentReducer = (state, event) => {
  const current = { ...state };
  const payload = event.payload || {};
  const meta = {
    lastEvent: event.eventType,
    version: event.version,
    updatedAt: event.timestamp,
  };

  if (event.eventType === "CONTAINER_CREATED") {
    return {
      ...current,
      shipmentId: event.shipmentId,
      origin: payload.origin || null,
      destination: payload.destination || null,
      containerType: payload.containerType || null,
      status: "CREATED",
      location: payload.origin || null,
      createdAt: event.timestamp,
      ...meta,
    };
  }

  if (LOCATION_EVENTS.includes(event.eventType)) {
    return {
      ...current,
      status: event.eventType,
      location: payload.location || current.location,
      carrier:
        event.eventType === "LOADED_ON_SHIP"
          ? payload.carrier || current.carrier || null
          : current.carrier,
      ...meta,
    };
  }

  if (event.eventType === "TEMPERATURE_SPIKE") {
    return {
      ...current,
      temperature: payload.temperature,
      temperatureUnit: payload.unit || "C",
      temperatureThreshold: payload.threshold || null,
      sensorId: payload.sensorId || null,
      temperatureAlert: payload.isSpike === true,
      ...meta,
    };
  }

  return { ...current, ...meta };
};

export const replayEvents = (events, upToVersion = Infinity) => {
  if (!events.length) return null;

  return [...events]
    .sort((a, b) => a.version - b.version)
    .filter((event) => event.version <= upToVersion)
    .reduce(shipmentReducer, initialShipmentState(events[0].shipmentId));
};
