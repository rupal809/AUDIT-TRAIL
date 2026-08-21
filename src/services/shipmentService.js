import { apiRequest } from "./api";
import { mockShipments } from "../Data/shipmentData";

const USE_MOCK_DATA =
  import.meta.env.VITE_USE_MOCK_DATA === "true";

export const getShipmentById = async (shipmentId) => {
  if (USE_MOCK_DATA) {
    const shipment = mockShipments[shipmentId];

    if (!shipment) {
      throw new Error("Shipment not found");
    }

    
    await new Promise((resolve) => setTimeout(resolve, 500));

    return shipment;
  }

  return apiRequest(
    `/shipments/${encodeURIComponent(shipmentId)}`
  );
};