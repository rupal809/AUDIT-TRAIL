/*
 * Mock event streams in the exact shape stored by the backend Event Store:
 * { shipmentId, eventType, payload, timestamp, version }
 * Used when VITE_USE_MOCK_DATA=true (demo without MongoDB).
 */

const stream = (shipmentId, events) =>
  events.map(([eventType, timestamp, payload], index) => ({
    _id: `${shipmentId}-v${index + 1}`,
    shipmentId,
    eventType,
    payload,
    timestamp,
    version: index + 1,
  }));

export const mockEventStreams = {
  // Case from the problem statement: temperature dispute over three days
  MSKU1234567: stream("MSKU1234567", [
    ["CONTAINER_CREATED", "2026-09-01T08:00:00.000Z", { origin: "Delhi Warehouse", destination: "Rotterdam", containerType: "REEFER", metadata: {} }],
    ["TEMPERATURE_SPIKE", "2026-09-01T09:00:00.000Z", { temperature: 4, unit: "C", threshold: 8, sensorId: "SNS-44", isSpike: false }],
    ["LOADED_ON_TRUCK", "2026-09-01T12:00:00.000Z", { status: "LOADED_ON_TRUCK", location: "Delhi Warehouse", carrier: null, notes: null }],
    ["TEMPERATURE_SPIKE", "2026-09-01T20:00:00.000Z", { temperature: 5, unit: "C", threshold: 8, sensorId: "SNS-44", isSpike: false }],
    ["LOADED_ON_SHIP", "2026-09-02T06:30:00.000Z", { status: "LOADED_ON_SHIP", location: "Mumbai Port (JNPT)", carrier: "Maersk Line", notes: "Vessel MSC Aurora" }],
    ["TEMPERATURE_SPIKE", "2026-09-02T10:30:00.000Z", { temperature: 11, unit: "C", threshold: 8, sensorId: "SNS-44", isSpike: true }],
    ["TEMPERATURE_SPIKE", "2026-09-02T18:00:00.000Z", { temperature: 6, unit: "C", threshold: 8, sensorId: "SNS-44", isSpike: false }],
    ["ARRIVED_AT_PORT", "2026-09-03T16:00:00.000Z", { status: "ARRIVED_AT_PORT", location: "Port of Salalah", carrier: null, notes: "Transshipment stop" }],
  ]),

  TCLU7654321: stream("TCLU7654321", [
    ["CONTAINER_CREATED", "2026-09-04T09:00:00.000Z", { origin: "Mumbai Warehouse", destination: "Singapore", containerType: "DRY_40FT", metadata: {} }],
    ["LOADED_ON_TRUCK", "2026-09-04T13:30:00.000Z", { status: "LOADED_ON_TRUCK", location: "Mumbai Warehouse", carrier: null, notes: null }],
    ["ARRIVED_AT_PORT", "2026-09-05T08:15:00.000Z", { status: "ARRIVED_AT_PORT", location: "JNPT Port", carrier: null, notes: null }],
    ["LOADED_ON_SHIP", "2026-09-06T16:45:00.000Z", { status: "LOADED_ON_SHIP", location: "JNPT Port", carrier: "CMA CGM", notes: null }],
    ["IN_TRANSIT", "2026-09-07T09:15:00.000Z", { status: "IN_TRANSIT", location: "Arabian Sea", carrier: null, notes: null }],
  ]),

  HLBU9876543: stream("HLBU9876543", [
    ["CONTAINER_CREATED", "2026-09-05T07:30:00.000Z", { origin: "Chennai Warehouse", destination: "Dubai", containerType: "REEFER", metadata: {} }],
    ["TEMPERATURE_SPIKE", "2026-09-05T08:00:00.000Z", { temperature: 5, unit: "C", threshold: 8, sensorId: "SNS-12", isSpike: false }],
    ["IN_TRANSIT", "2026-09-06T10:00:00.000Z", { status: "IN_TRANSIT", location: "Chennai–Kochi Highway", carrier: null, notes: null }],
    ["TEMPERATURE_SPIKE", "2026-09-06T22:00:00.000Z", { temperature: 10, unit: "C", threshold: 8, sensorId: "SNS-12", isSpike: true }],
    ["ARRIVED_AT_PORT", "2026-09-07T15:20:00.000Z", { status: "ARRIVED_AT_PORT", location: "Kochi Port", carrier: null, notes: null }],
    ["LOADED_ON_SHIP", "2026-09-08T07:45:00.000Z", { status: "LOADED_ON_SHIP", location: "Kochi Port", carrier: "Hapag-Lloyd", notes: null }],
  ]),

  CMAU1122334: stream("CMAU1122334", [
    ["CONTAINER_CREATED", "2026-09-08T11:00:00.000Z", { origin: "Delhi Warehouse", destination: "Hamburg", containerType: "DRY_20FT", metadata: {} }],
  ]),
};

export const demoShipmentIds = Object.keys(mockEventStreams);
