```javascript
export const mockShipments = {
  MSKU1234567: {
    id: "MSKU1234567",
    status: "Arrived at Port",
    location: "Mumbai Port",
    version: 4,
    lastEvent: "ARRIVED_AT_PORT",
    lastUpdated: "10:30 AM",

    events: [
      {
        id: "EVT001",
        eventType: "CONTAINER_CREATED",
        timestamp: "2026-08-26T08:30:00",
        location: "Delhi Warehouse",
        description: "Container created and shipment details registered.",
        status: "completed",
      },
      {
        id: "EVT002",
        eventType: "LOADED_ON_TRUCK",
        timestamp: "2026-08-26T12:15:00",
        location: "Delhi Warehouse",
        description: "Container loaded onto the assigned truck.",
        status: "completed",
      },
      {
        id: "EVT003",
        eventType: "IN_TRANSIT",
        timestamp: "2026-08-27T06:45:00",
        location: "Agra Highway",
        description: "Container is currently in transit to Mumbai.",
        status: "completed",
      },
      {
        id: "EVT004",
        eventType: "ARRIVED_AT_PORT",
        timestamp: "2026-08-28T10:30:00",
        location: "Mumbai Port",
        description: "Container arrived at Mumbai Port.",
        status: "current",
      },
    ],
  },

  TCLU7654321: {
    id: "TCLU7654321",
    status: "In Transit",
    location: "Arabian Sea",
    version: 3,
    lastEvent: "LOADED_ON_SHIP",
    lastUpdated: "09:15 AM",

    events: [
      {
        id: "EVT101",
        eventType: "CONTAINER_CREATED",
        timestamp: "2026-08-24T09:00:00",
        location: "Mumbai Warehouse",
        description: "Shipment created successfully.",
        status: "completed",
      },
      {
        id: "EVT102",
        eventType: "LOADED_ON_TRUCK",
        timestamp: "2026-08-24T13:30:00",
        location: "Mumbai Warehouse",
        description: "Container loaded onto truck.",
        status: "completed",
      },
      {
        id: "EVT103",
        eventType: "ARRIVED_AT_PORT",
        timestamp: "2026-08-25T08:15:00",
        location: "JNPT Port",
        description: "Container arrived at JNPT Port.",
        status: "completed",
      },
      {
        id: "EVT104",
        eventType: "LOADED_ON_SHIP",
        timestamp: "2026-08-26T16:45:00",
        location: "JNPT Port",
        description: "Container loaded onto cargo vessel.",
        status: "completed",
      },
      {
        id: "EVT105",
        eventType: "IN_TRANSIT",
        timestamp: "2026-08-28T09:15:00",
        location: "Arabian Sea",
        description: "Vessel is currently in transit.",
        status: "current",
      },
    ],
  },

  HLBU9876543: {
    id: "HLBU9876543",
    status: "Loaded on Ship",
    location: "JNPT Port",
    version: 5,
    lastEvent: "LOADED_ON_SHIP",
    lastUpdated: "07:45 AM",

    events: [
      {
        id: "EVT201",
        eventType: "CONTAINER_CREATED",
        timestamp: "2026-08-25T07:30:00",
        location: "Delhi Warehouse",
        description: "Container created.",
        status: "completed",
      },
      {
        id: "EVT202",
        eventType: "IN_TRANSIT",
        timestamp: "2026-08-26T10:00:00",
        location: "Delhi-Mumbai Highway",
        description: "Container transported toward Mumbai.",
        status: "completed",
      },
      {
        id: "EVT203",
        eventType: "ARRIVED_AT_PORT",
        timestamp: "2026-08-27T15:20:00",
        location: "JNPT Port",
        description: "Container arrived at JNPT Port.",
        status: "completed",
      },
      {
        id: "EVT204",
        eventType: "LOADED_ON_SHIP",
        timestamp: "2026-08-28T07:45:00",
        location: "JNPT Port",
        description: "Container successfully loaded onto vessel.",
        status: "current",
      },
    ],
  },

  CMAU1122334: {
    id: "CMAU1122334",
    status: "Created",
    location: "Delhi Warehouse",
    version: 1,
    lastEvent: "CONTAINER_CREATED",
    lastUpdated: "Yesterday",

    events: [
      {
        id: "EVT301",
        eventType: "CONTAINER_CREATED",
        timestamp: "2026-08-27T11:00:00",
        location: "Delhi Warehouse",
        description: "Container created and awaiting pickup.",
        status: "current",
      },
    ],
  },
};
```
