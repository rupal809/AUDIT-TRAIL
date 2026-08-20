import {
  mockDashboardStats,
  mockShipment,
  mockAuditTrail,
  mockEvents,
  mockDelayedContainers,
} from "../Data/dashboardData";


// dashboard ka data




export const getDashboardStats = async () => {
  // Simulating API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  return mockDashboardStats;
};



// shipment ka data

export const getShipment = async (shipmentId) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (!shipmentId) {
    throw new Error("Shipment ID is required");
  }

  
  return {
    ...mockShipment,
    shipmentId: shipmentId,
  };
};



export const getShipmentAuditTrail = async (shipmentId) => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  if (!shipmentId) {
    throw new Error("Shipment ID is required");
  }

  return mockAuditTrail;
};




export const getRecentEvents = async () => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  return mockEvents;
};

export const getDelayedContainers = async () => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  return mockDelayedContainers;
};