const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    shipmentId: {
      type: String,
      required: true,
      index: true,
    },

    eventType: {
      type: String,
      required: true,
    },

    payload: {
      type: Object,
      default: {},
    },

    timestamp: {
      type: Date,
      default: Date.now,
      immutable: true,
    },

    version: {
      type: Number,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

EventSchema.index(
  { shipmentId: 1, version: 1 },
  { unique: true }
);

EventSchema.pre(
  [
    "updateOne",
    "updateMany",
    "findOneAndUpdate",
  ],
  function (next) {
    next(
      new Error(
        "Events are immutable and cannot be updated."
      )
    );
  }
);

EventSchema.pre(
  [
    "deleteOne",
    "deleteMany",
    "findOneAndDelete",
  ],
  function (next) {
    next(
      new Error(
        "Events are immutable and cannot be deleted."
      )
    );
  }
);

module.exports = mongoose.model("Event", EventSchema);