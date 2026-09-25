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

// Immutability guards.
// Hooks throw instead of calling next(): works in Mongoose 8 and 9
// (Mongoose 9 no longer passes next() to pre middleware).
EventSchema.pre(
  [
    "updateOne",
    "updateMany",
    "findOneAndUpdate",
    "replaceOne",
    "findOneAndReplace",
  ],
  function () {
    throw new Error("Events are immutable and cannot be updated.");
  }
);

EventSchema.pre(
  [
    "deleteOne",
    "deleteMany",
    "findOneAndDelete",
  ],
  function () {
    throw new Error("Events are immutable and cannot be deleted.");
  }
);

// Block doc.save() on an already-stored event (only inserts allowed)
EventSchema.pre("save", function () {
  if (!this.isNew) {
    throw new Error("Events are immutable and cannot be updated.");
  }
});

module.exports = mongoose.model("Event", EventSchema);