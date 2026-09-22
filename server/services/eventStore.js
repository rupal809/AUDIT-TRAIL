const Event = require("../models/Event");

class ConcurrencyError extends Error {
  constructor(message) {
    super(message);
    this.name = "ConcurrencyError";
    this.statusCode = 409;
  }
}

const getCurrentVersion = async (shipmentId) => {
  const latestEvent = await Event.findOne({ shipmentId })
    .sort({ version: -1 })
    .select("version")
    .lean();

  return latestEvent ? latestEvent.version : 0;
};

const appendEvent = async ({
  shipmentId,
  eventType,
  payload = {},
  expectedVersion,
}) => {
  if (!shipmentId) {
    throw new Error("shipmentId is required");
  }

  if (!eventType) {
    throw new Error("eventType is required");
  }

  const currentVersion = await getCurrentVersion(shipmentId);

  if (
    expectedVersion !== undefined &&
    expectedVersion !== currentVersion
  ) {
    throw new ConcurrencyError(
      `Version conflict. Expected ${expectedVersion}, current version is ${currentVersion}`
    );
  }

  const nextVersion = currentVersion + 1;

  try {
    const event = await Event.create({
      shipmentId,
      eventType,
      payload,
      timestamp: new Date(),
      version: nextVersion,
    });

    return event;
  } catch (error) {
    if (error.code === 11000) {
      throw new ConcurrencyError(
        "Concurrent update detected. Event version already exists."
      );
    }

    throw error;
  }
};

const getEventStream = async (shipmentId) => {
  if (!shipmentId) {
    throw new Error("shipmentId is required");
  }

  return Event.find({ shipmentId }).sort({ version: 1 }).lean();
};

const replay = async (shipmentId, reducer, initialState = {}) => {
  const events = await getEventStream(shipmentId);

  return events.reduce(
    (state, event) => reducer(state, event),
    initialState
  );
};

module.exports = {
  ConcurrencyError,
  appendEvent,
  getEventStream,
  getCurrentVersion,
  replay,
};