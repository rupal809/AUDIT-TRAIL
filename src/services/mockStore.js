/*
 * In-memory Event Store used in mock mode.
 * Mimics the backend rules: append-only, version per shipment,
 * optimistic concurrency (409 on version mismatch), 404 for unknown shipments.
 * Data resets on page refresh.
 */
import { mockEventStreams } from "../Data/shipmentData";
import { ApiError } from "./api";

const streams = Object.fromEntries(
  Object.entries(mockEventStreams).map(([id, events]) => [id, [...events]])
);

const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));

const clone = (value) => JSON.parse(JSON.stringify(value));

export const mockGetStream = async (shipmentId) => {
  await delay();
  const events = streams[shipmentId];
  if (!events) throw new ApiError("Event stream not found", 404);
  return clone(events);
};

export const mockGetAllEvents = async () => {
  await delay();
  return clone(Object.values(streams).flat());
};

export const mockCurrentVersion = (shipmentId) =>
  streams[shipmentId]?.length || 0;

export const mockAppendEvent = async ({
  shipmentId,
  eventType,
  payload,
  expectedVersion,
}) => {
  await delay();
  const currentVersion = mockCurrentVersion(shipmentId);

  if (expectedVersion !== currentVersion) {
    throw new ApiError(
      `Version conflict. Expected ${expectedVersion}, current version is ${currentVersion}`,
      409
    );
  }

  const event = {
    _id: `${shipmentId}-v${currentVersion + 1}`,
    shipmentId,
    eventType,
    payload,
    timestamp: new Date().toISOString(),
    version: currentVersion + 1,
  };

  (streams[shipmentId] ||= []).push(event);
  return clone(event);
};
