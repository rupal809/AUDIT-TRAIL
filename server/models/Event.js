const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  shipmentId: String,
  eventType: String,
  payload: Object,
  timestamp: {
    type: Date,
    default: Date.now
  },
  version: Number
});

module.exports = mongoose.model("Event", EventSchema);