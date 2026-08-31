const express = require('express');
const router = express.Router();

const {
  appendEvent,
  getEventStream,
  getCurrentVersion,
  ConcurrencyError,
} = require('../services/eventStore');

router.post('/', async (req, res) => {
  const {
    aggregateId,
    aggregateType,
    eventType,
    payload,
    expectedVersion,
    metadata,
  } = req.body;

  try {
    const event = await appendEvent({
      aggregateId,
      aggregateType,
      eventType,
      payload,
      expectedVersion,
      metadata,
    });

    return res.status(201).json(event);
  } catch (err) {
    if (err instanceof ConcurrencyError) {
      return res.status(409).json({
        error: err.message,
        aggregateId: err.aggregateId,
      });
    }

    if (
      err.message.includes('required') ||
      err.message.includes('expectedVersion')
    ) {
      return res.status(400).json({ error: err.message });
    }

    console.error('Failed to append event:', err);
    return res.status(500).json({
      error: 'Internal server error while appending event.',
    });
  }
});

router.get('/:aggregateId', async (req, res) => {
  const { aggregateId } = req.params;
  const fromVersion = req.query.fromVersion
    ? Number(req.query.fromVersion)
    : 0;

  if (Number.isNaN(fromVersion) || fromVersion < 0) {
    return res.status(400).json({
      error: 'fromVersion must be a non-negative number.',
    });
  }

  try {
    const events = await getEventStream(aggregateId, { fromVersion });

    return res.json({
      aggregateId,
      fromVersion,
      count: events.length,
      events,
    });
  } catch (err) {
    console.error('Failed to fetch event stream:', err);
    return res.status(500).json({
      error: 'Internal server error while fetching events.',
    });
  }
});

router.get('/:aggregateId/version', async (req, res) => {
  const { aggregateId } = req.params;

  try {
    const version = await getCurrentVersion(aggregateId);

    return res.json({
      aggregateId,
      version,
    });
  } catch (err) {
    console.error('Failed to fetch current version:', err);
    return res.status(500).json({
      error: 'Internal server error while fetching version.',
    });
  }
});

module.exports = router;
