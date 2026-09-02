import React from "react";
import "./ShipmentDetails.css";

function ShipmentDetails({ shipment }) {
  if (!shipment) {
    return null;
  }

  return (
    <div className="shipment-details">
  <h2>Shipment Details</h2>

  <div className="shipment-info">

    <div className="shipment-item">
      <span>Shipment ID</span>
      <strong>MSKU1234567</strong>
    </div>

    <div className="shipment-item status-box">
      <span>Current Status</span>
      <strong>Arrived at Port</strong>
    </div>

    <div className="shipment-item">
      <span>Current Location</span>
      <strong>Mumbai Port</strong>
    </div>

    <div className="shipment-item">
      <span>Version</span>
      <strong>4</strong>
    </div>

    <div className="shipment-item">
      <span>Last Event</span>
      <strong>ARRIVED_AT_PORT</strong>
    </div>

    <div className="shipment-item">
      <span>Last Updated</span>
      <strong>10:30 AM</strong>
    </div>

  </div>
</div>
  );
}

export default ShipmentDetails;