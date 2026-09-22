const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  shipmentId: String,
  eventType: String,
  payload: Object,
  timestamp: {
    type: Date,
    default: Date.now,
  },
  version: Number,
});

// Prevent update operations
const preventUpdate = function () {
  throw new Error("Events are immutable and cannot be updated");
};

EventSchema.pre("updateOne", preventUpdate);
EventSchema.pre("updateMany", preventUpdate);
EventSchema.pre("findOneAndUpdate", preventUpdate);

// Prevent delete operations
const preventDelete = function () {
  throw new Error("Events are immutable and cannot be deleted");
};

EventSchema.pre("deleteOne", preventDelete);
EventSchema.pre("deleteMany", preventDelete);
EventSchema.pre("findOneAndDelete", preventDelete);
module.exports = mongoose.model("Event", EventSchema);
