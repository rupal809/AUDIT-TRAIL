const shipmentReducer = (state, event) => {
  const currentState = {
    ...state,
  };

  const payload = event.payload || {};

  switch (event.eventType) {
    case "CONTAINER_CREATED":
      return {
        ...currentState,
        shipmentId: event.shipmentId,
        origin: payload.origin || null,
        destination: payload.destination || null,
        containerType: payload.containerType || null,
        status: "CREATED",
        location: payload.origin || null,
        createdAt: event.timestamp,
        lastEvent: event.eventType,
        version: event.version,
        updatedAt: event.timestamp,
      };

    case "LOADED_ON_SHIP":
      return {
        ...currentState,
        status: "LOADED_ON_SHIP",
        location: payload.location || currentState.location,
        carrier: payload.carrier || currentState.carrier || null,
        lastEvent: event.eventType,
        version: event.version,
        updatedAt: event.timestamp,
      };

    case "ARRIVED_AT_PORT":
      return {
        ...currentState,
        status: "ARRIVED_AT_PORT",
        location: payload.location || currentState.location,
        lastEvent: event.eventType,
        version: event.version,
        updatedAt: event.timestamp,
      };

    case "SHIPMENT_MOVED":
      return {
        ...currentState,
        status: "SHIPMENT_MOVED",
        location: payload.location || currentState.location,
        lastEvent: event.eventType,
        version: event.version,
        updatedAt: event.timestamp,
      };

    case "IN_TRANSIT":
      return {
        ...currentState,
        status: "IN_TRANSIT",
        location: payload.location || currentState.location,
        lastEvent: event.eventType,
        version: event.version,
        updatedAt: event.timestamp,
      };

    case "LOADED_ON_TRUCK":
      return {
        ...currentState,
        status: "LOADED_ON_TRUCK",
        location: payload.location || currentState.location,
        lastEvent: event.eventType,
        version: event.version,
        updatedAt: event.timestamp,
      };

    case "DELIVERED":
      return {
        ...currentState,
        status: "DELIVERED",
        location: payload.location || currentState.location,
        lastEvent: event.eventType,
        version: event.version,
        updatedAt: event.timestamp,
      };

    case "TEMPERATURE_SPIKE":
      return {
        ...currentState,
        temperature: payload.temperature,
        temperatureUnit: payload.unit || "C",
        temperatureThreshold: payload.threshold || null,
        sensorId: payload.sensorId || null,
        temperatureAlert: payload.isSpike === true,
        lastEvent: event.eventType,
        version: event.version,
        updatedAt: event.timestamp,
      };

    default:
      return {
        ...currentState,
        lastEvent: event.eventType,
        version: event.version,
        updatedAt: event.timestamp,
      };
  }
};

module.exports = shipmentReducer;