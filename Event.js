const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    aggregateId: {
      type: String,
      required: true,
      index: true,
    },

    aggregateType: {
      type: String,
      required: true,
    },

    eventType: {
      type: String,
      required: true,
    },

    version: {
      type: Number,
      required: true,
    },

    payload: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    metadata: {
      userId: { type: String },
      correlationId: { type: String },
      causationId: { type: String },
      source: { type: String },
    },

    timestamp: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
  },
  {
    strict: 'throw',
  }
);

eventSchema.index(
  { aggregateId: 1, version: 1 },
  { unique: true }
);

eventSchema.index(
  { aggregateId: 1, version: 1 },
  { name: 'stream_order' }
);

eventSchema.pre(
  ['updateOne', 'updateMany', 'findOneAndUpdate'],
  function () {
    throw new Error(
      'Events are immutable: updates are not permitted on the event store.'
    );
  }
);

eventSchema.pre(
  ['deleteOne', 'deleteMany', 'findOneAndDelete'],
  function () {
    throw new Error(
      'Events are immutable: deletes are not permitted on the event store.'
    );
  }
);

module.exports = mongoose.model('Event', eventSchema);
