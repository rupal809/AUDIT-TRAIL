const mongoose = require("mongoose");

const ShipmentReadModelSchema = new mongoose.Schema(
  {
    shipmentId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    status: {
      type: String,
      default: "UNKNOWN",
    },

    location: {
      type: String,
      default: null,
    },

    origin: {
      type: String,
      default: null,
    },

    destination: {
      type: String,
      default: null,
    },

    containerType: {
      type: String,
      default: null,
    },

    carrier: {
      type: String,
      default: null,
    },

    temperature: {
      type: Number,
      default: null,
    },

    temperatureUnit: {
      type: String,
      default: null,
    },

    temperatureAlert: {
      type: Boolean,
      default: false,
    },

    sensorId: {
      type: String,
      default: null,
    },

    lastEvent: {
      type: String,
      default: null,
    },

    version: {
      type: Number,
      default: 0,
    },

    createdAt: {
      type: Date,
      default: null,
    },

    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "shipmentreadmodels",
  }
);

module.exports = mongoose.model(
  "ShipmentReadModel",
  ShipmentReadModelSchema
);