import React from "react";
import "./ShipmentTimeline.css";
import RewindSlider from "./RewindSlider";

function ShipmentTimeline({ events = [] }) {
  return (
    <div className="shipment-timeline">
      <RewindSlider events={events} />
    </div>
  );
}

export default ShipmentTimeline;