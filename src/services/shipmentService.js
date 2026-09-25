import { apiRequest, ApiError, USE_MOCK_DATA } from "./api";
import {
  mockAppendEvent,
  mockCurrentVersion,
  mockGetStream,
} from "./mockStore";
import { replayEvents } from "../utils/shipmentReducer";
import { buildHashChain } from "../utils/hashChain";

const enc = encodeURIComponent;

const notFound = (error, shipmentId) => {
  if (error instanceof ApiError && error.status === 404) {
    throw new ApiError(`Shipment "${shipmentId}" not found.`, 404);
  }
  throw error;
};

/* ------------------------------ QUERIES ------------------------------ */

// Full audit view: server-replayed state + raw immutable event stream
export const getShipmentAudit = async (shipmentId) => {
  try {
    if (USE_MOCK_DATA) {
      const events = await mockGetStream(shipmentId);
      return { state: replayEvents(events), events };
    }

    const [replay, stream] = await Promise.all([
      apiRequest(`/replay/${enc(shipmentId)}/state`),
      apiRequest(`/events/${enc(shipmentId)}`),
    ]);

    return { state: replay.state, events: stream.events };
  } catch (error) {
    return notFound(error, shipmentId);
  }
};

// Point-in-time reconstruction performed by the backend
export const getStateAtVersion = async (shipmentId, version) => {
  if (USE_MOCK_DATA) {
    const events = await mockGetStream(shipmentId);
    return replayEvents(events, version);
  }

  const data = await apiRequest(
    `/replay/${enc(shipmentId)}/state?version=${version}`
  );
  return data.state;
};

// Hash chain as computed by the backend
export const getIntegrityProof = async (shipmentId) => {
  if (USE_MOCK_DATA) {
    const events = await mockGetStream(shipmentId);
    return buildHashChain(events);
  }

  return apiRequest(`/events/${enc(shipmentId)}/proof`);
};

export const getCurrentVersion = async (shipmentId) => {
  if (USE_MOCK_DATA) {
    return mockCurrentVersion(shipmentId);
  }

  const data = await apiRequest(`/events/${enc(shipmentId)}/version`);
  return data.version;
};

/* ------------------------------ COMMANDS ----------------------------- */

export const createShipment = async ({
  shipmentId,
  origin,
  destination,
  containerType,
}) => {
  if (USE_MOCK_DATA) {
    if (mockCurrentVersion(shipmentId) !== 0) {
      throw new ApiError("Shipment already exists", 409);
    }
    const event = await mockAppendEvent({
      shipmentId,
      eventType: "CONTAINER_CREATED",
      payload: {
        origin,
        destination,
        containerType: containerType || null,
        metadata: {},
      },
      expectedVersion: 0,
    });
    return { message: "Shipment created successfully", event };
  }

  return apiRequest("/shipment/create", {
    method: "POST",
    body: JSON.stringify({ shipmentId, origin, destination, containerType }),
  });
};

export const recordMovement = async ({
  shipmentId,
  status,
  location,
  carrier,
  notes,
  expectedVersion,
}) => {
  if (USE_MOCK_DATA) {
    if (mockCurrentVersion(shipmentId) === 0) {
      throw new ApiError("Shipment not found", 404);
    }
    const event = await mockAppendEvent({
      shipmentId,
      eventType: status,
      payload: {
        status,
        location,
        carrier: carrier || null,
        notes: notes || null,
      },
      expectedVersion,
    });
    return { message: "Shipment movement recorded successfully", event };
  }

  return apiRequest("/shipment/move", {
    method: "POST",
    body: JSON.stringify({
      shipmentId,
      status,
      location,
      carrier,
      notes,
      expectedVersion,
    }),
  });
};

export const recordTemperature = async ({
  shipmentId,
  temperature,
  unit,
  threshold,
  sensorId,
  expectedVersion,
}) => {
  if (USE_MOCK_DATA) {
    if (mockCurrentVersion(shipmentId) === 0) {
      throw new ApiError("Shipment not found", 404);
    }
    const isSpike =
      typeof threshold === "number"
        ? Math.abs(temperature) > Math.abs(threshold)
        : false;
    const event = await mockAppendEvent({
      shipmentId,
      eventType: "TEMPERATURE_SPIKE",
      payload: {
        temperature,
        unit: unit || "C",
        threshold: typeof threshold === "number" ? threshold : null,
        sensorId: sensorId || null,
        isSpike,
      },
      expectedVersion,
    });
    return { message: "Temperature event recorded successfully", event };
  }

  return apiRequest("/shipment/temperature", {
    method: "POST",
    body: JSON.stringify({
      shipmentId,
      temperature,
      unit,
      threshold,
      sensorId,
      expectedVersion,
    }),
  });
};
