/**
 * server/routes/commands/shipment.js
 *
 * Command-side API for the Shipment aggregate
 * (Audit Trail — Event Sourcing + CQRS).
 */

const express = require('express');
const router = express.Router();

const { getEventStore } = require('../../services/eventStore');

// Event types
const EVENT_TYPES = {
  CONTAINER_CREATED: 'CONTAINER_CREATED',
  LOADED_ON_SHIP: 'LOADED_ON_SHIP',
  TEMPERATURE_SPIKE: 'TEMPERATURE_SPIKE',
  ARRIVED_AT_PORT: 'ARRIVED_AT_PORT',
  SHIPMENT_MOVED: 'SHIPMENT_MOVED',
};

// Append event to MongoDB Event Store
async function appendEvent(shipmentId, type, payload) {
  const eventStore = await getEventStore();

  const event = {
    shipmentId,
    type,
    payload,
    timestamp: new Date().toISOString(),
  };

  const result = await eventStore.insertOne(event);

  return {
    ...event,
    _id: result.insertedId,
  };
}

/*
 * POST /shipment/create
 *
 * Body:
 * {
 *   shipmentId,
 *   origin,
 *   destination,
 *   containerType?,
 *   metadata?
 * }
 */
router.post('/create', async (req, res) => {
  try {
    const {
      shipmentId,
      origin,
      destination,
      containerType,
      metadata,
    } = req.body;

    if (!shipmentId || !origin || !destination) {
      return res.status(400).json({
        error: 'shipmentId, origin, and destination are required',
      });
    }

    const eventStore = await getEventStore();

    const existing = await eventStore.findOne({
      shipmentId,
      type: EVENT_TYPES.CONTAINER_CREATED,
    });

    if (existing) {
      return res.status(409).json({
        error: `Shipment ${shipmentId} already exists`,
      });
    }

    const event = await appendEvent(
      shipmentId,
      EVENT_TYPES.CONTAINER_CREATED,
      {
        origin,
        destination,
        containerType: containerType || null,
        metadata: metadata || {},
      }
    );

    return res.status(201).json({ event });

  } catch (err) {
    console.error('POST /shipment/create failed:', err);

    return res.status(500).json({
      error: 'Failed to create shipment',
    });
  }
});

/*
 * POST /shipment/move
 *
 * Body:
 * {
 *   shipmentId,
 *   status,
 *   location,
 *   carrier?,
 *   notes?
 * }
 */
router.post('/move', async (req, res) => {
  try {
    const {
      shipmentId,
      status,
      location,
      carrier,
      notes,
    } = req.body;

    const allowedStatuses = [
      EVENT_TYPES.LOADED_ON_SHIP,
      EVENT_TYPES.ARRIVED_AT_PORT,
      EVENT_TYPES.SHIPMENT_MOVED,
    ];

    if (!shipmentId || !status || !location) {
      return res.status(400).json({
        error: 'shipmentId, status, and location are required',
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        error: `status must be one of: ${allowedStatuses.join(', ')}`,
      });
    }

    const eventStore = await getEventStore();

    const created = await eventStore.findOne({
      shipmentId,
      type: EVENT_TYPES.CONTAINER_CREATED,
    });

    if (!created) {
      return res.status(404).json({
        error: `Shipment ${shipmentId} does not exist`,
      });
    }

    const event = await appendEvent(
      shipmentId,
      status,
      {
        location,
        carrier: carrier || null,
        notes: notes || null,
      }
    );

    return res.status(201).json({ event });

  } catch (err) {
    console.error('POST /shipment/move failed:', err);

    return res.status(500).json({
      error: 'Failed to record movement',
    });
  }
});

/*
 * POST /shipment/temperature
 *
 * Body:
 * {
 *   shipmentId,
 *   temperature,
 *   unit?,
 *   threshold?,
 *   sensorId?
 * }
 */
router.post('/temperature', async (req, res) => {
  try {
    const {
      shipmentId,
      temperature,
      unit,
      threshold,
      sensorId,
    } = req.body;

    if (
      !shipmentId ||
      temperature === undefined ||
      temperature === null
    ) {
      return res.status(400).json({
        error: 'shipmentId and temperature are required',
      });
    }

    if (
      typeof temperature !== 'number' ||
      Number.isNaN(temperature)
    ) {
      return res.status(400).json({
        error: 'temperature must be a number',
      });
    }

    const eventStore = await getEventStore();

    const created = await eventStore.findOne({
      shipmentId,
      type: EVENT_TYPES.CONTAINER_CREATED,
    });

    if (!created) {
      return res.status(404).json({
        error: `Shipment ${shipmentId} does not exist`,
      });
    }

    const isSpike =
      typeof threshold === 'number' &&
      temperature > threshold;

    const event = await appendEvent(
      shipmentId,
      EVENT_TYPES.TEMPERATURE_SPIKE,
      {
        temperature,
        unit: unit || 'C',
        threshold: threshold ?? null,
        sensorId: sensorId || null,
        isSpike,
      }
    );

    return res.status(201).json({ event });

  } catch (err) {
    console.error('POST /shipment/temperature failed:', err);

    return res.status(500).json({
      error: 'Failed to record temperature event',
    });
  }
});

module.exports = router;