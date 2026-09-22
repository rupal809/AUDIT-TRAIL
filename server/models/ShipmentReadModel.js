const mongoose = require("mongoose");

const ShipmentReadModelSchema = new mongoose.Schema({
  shipmentId: {
    type: String,
    required: true,
    unique: true,
  },

  status: {
    type: String,
  },

  location: {
    type: String,
  },

  lastEvent: {
    type: String,
  },

  version: {
    type: Number,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ShipmentReadModel", ShipmentReadModelSchema);
