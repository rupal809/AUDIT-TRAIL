export const mockDashboardStats = {
  totalContainers: 1248,
  inTransit: 842,
  delivered: 356,
  activeAlerts: 23,
};


export const mockShipment = {
  shipmentId: "MSKU1234567",

  status: "Arrived at Port",

  location: "Mumbai Port",

  version: 4,

  lastEvent: "ARRIVED_AT_PORT",

  lastUpdated: "2026-08-20T10:30:00",
};


export const mockAuditTrail = [
  {
    version: 1,

    eventType: "CONTAINER_CREATED",

    timestamp: "2026-08-18T08:00:00",

    payload: {
      location: "Delhi",
    },
  },

  {
    version: 2,

    eventType: "LOADED_ON_SHIP",

    timestamp: "2026-08-18T14:30:00",

    payload: {
      ship: "MSC Aurora",
    },
  },


  {
    version: 3,

    eventType: "TEMPERATURE_SPIKE",

    timestamp: "2026-08-19T09:15:00",

    payload: {
      temperature: 12.5,
    },
  },

  {
    version: 4,

    eventType: "ARRIVED_AT_PORT",

    timestamp: "2026-08-20T10:30:00",

    payload: {
      location: "Mumbai Port",
    },
  },
];


export const mockEvents = [
  {
    title: "Container arrived at Mumbai Port",
    id: "MSKU1234567",
    time: "10:30 AM",
    type: "success",
  },

  {
    title: "Temperature spike detected",
    id: "TCLU7654321",
    time: "09:15 AM",
    type: "warning",
  },

  {
    title: "Loaded on ship",
    id: "HLBU9876543",
    time: "07:45 AM",
    type: "info",
  },

  {
    title: "Container created",
    id: "CMAU1122334",
    time: "Yesterday",
    type: "danger",
  },
];

export const mockDelayedContainers = [
  {
    id: "MSKU1234567",
    delay: "2.4 days delay",
  },

  {
    id: "TCLU7654321",
    delay: "1.8 days delay",
  },

  {
    id: "HLBU9876543",
    delay: "1.2 days delay",
  },

  {
    id: "CMAU1122334",
    delay: "0.9 days delay",
  },
];