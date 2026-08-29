export const mockShipments = {
  MSKU1234567: {
    id: "MSKU1234567",
    status: "Arrived at Port",
    location: "Mumbai Port",
    version: 4,
    lastEvent: "ARRIVED_AT_PORT",
    lastUpdated: "10:30 AM",
  },

  TCLU7654321: {
    id: "TCLU7654321",
    status: "In Transit",
    location: "Arabian Sea",
    version: 3,
    lastEvent: "LOADED_ON_SHIP",
    lastUpdated: "09:15 AM",
  },

  HLBU9876543: {
    id: "HLBU9876543",
    status: "Loaded on Ship",
    location: "JNPT Port",
    version: 5,
    lastEvent: "LOADED_ON_SHIP",
    lastUpdated: "07:45 AM",
  },

  CMAU1122334: {
    id: "CMAU1122334",
    status: "Created",
    location: "Delhi Warehouse",
    version: 1,
    lastEvent: "CONTAINER_CREATED",
    lastUpdated: "Yesterday",
  },
};