const shipmentReducer = require("../reducers/shipmentReducer");

const IN_TRANSIT_STATUSES = [
  "LOADED_ON_TRUCK",
  "LOADED_ON_SHIP",
  "IN_TRANSIT",
  "SHIPMENT_MOVED",
];

const dayKey = (date) => new Date(date).toISOString().slice(0, 10);

/*
 * Builds dashboard data by folding every shipment's event stream.
 * Mirrors src/utils/dashboardSummary.js on the frontend (used in mock mode).
 */
const buildDashboardSummary = (events) => {
  const streams = new Map();

  events.forEach((event) => {
    if (!streams.has(event.shipmentId)) {
      streams.set(event.shipmentId, []);
    }
    streams.get(event.shipmentId).push(event);
  });

  const shipments = [...streams.entries()].map(([shipmentId, stream]) =>
    stream
      .sort((a, b) => a.version - b.version)
      .reduce(shipmentReducer, {
        shipmentId,
        status: "UNKNOWN",
        location: null,
        version: 0,
      })
  );

  const statusCounts = shipments.reduce((counts, shipment) => {
    counts[shipment.status] = (counts[shipment.status] || 0) + 1;
    return counts;
  }, {});

  const alerts = shipments
    .filter((shipment) => shipment.temperatureAlert)
    .map((shipment) => ({
      shipmentId: shipment.shipmentId,
      temperature: shipment.temperature,
      temperatureUnit: shipment.temperatureUnit,
      threshold: shipment.temperatureThreshold,
      location: shipment.location,
      updatedAt: shipment.updatedAt,
    }));

  const recentEvents = [...events]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 8)
    .map((event) => ({
      shipmentId: event.shipmentId,
      eventType: event.eventType,
      version: event.version,
      timestamp: event.timestamp,
      payload: event.payload || {},
    }));

  // 7-day activity window ending on the day of the latest event
  const latest = events.length
    ? Math.max(...events.map((event) => new Date(event.timestamp).getTime()))
    : Date.now();

  const activity = [];
  for (let offset = 6; offset >= 0; offset -= 1) {
    const date = new Date(latest - offset * 24 * 60 * 60 * 1000);
    activity.push({ date: dayKey(date), count: 0 });
  }

  events.forEach((event) => {
    const bucket = activity.find((day) => day.date === dayKey(event.timestamp));
    if (bucket) {
      bucket.count += 1;
    }
  });

  const count = (statuses) =>
    statuses.reduce((sum, status) => sum + (statusCounts[status] || 0), 0);

  return {
    totals: {
      shipments: shipments.length,
      events: events.length,
      inTransit: count(IN_TRANSIT_STATUSES),
      atPort: count(["ARRIVED_AT_PORT"]),
      delivered: count(["DELIVERED"]),
      created: count(["CREATED"]),
      activeAlerts: alerts.length,
    },
    statusCounts,
    alerts,
    recentEvents,
    activity,
  };
};

module.exports = { buildDashboardSummary };
