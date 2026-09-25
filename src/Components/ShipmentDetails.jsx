import StatusBadge from "./StatusBadge";
import { formatDateTime, humanize } from "../utils/format";

function ShipmentDetails({ shipment, eventCount, children }) {
  if (!shipment) {
    return null;
  }

  const temperature =
    shipment.temperature !== undefined && shipment.temperature !== null
      ? `${shipment.temperature}°${shipment.temperatureUnit || "C"}`
      : "No readings";

  const items = [
    ["Shipment ID", <span className="mono">{shipment.shipmentId}</span>],
    ["Current Status", <StatusBadge status={shipment.status} />],
    ["Current Location", shipment.location || "—"],
    ["Route", `${shipment.origin || "?"} → ${shipment.destination || "?"}`],
    ["Container Type", humanize(shipment.containerType)],
    ["Carrier", shipment.carrier || "—"],
    [
      "Last Temperature",
      <span className={shipment.temperatureAlert ? "text-danger" : ""}>
        {temperature}
        {shipment.temperatureAlert ? " ⚠ above threshold" : ""}
      </span>,
    ],
    ["Version", `v${shipment.version} · ${eventCount} events`],
    ["Last Event", humanize(shipment.lastEvent)],
    ["Created", formatDateTime(shipment.createdAt)],
    ["Last Updated", formatDateTime(shipment.updatedAt)],
  ];

  return (
    <section className="card shipment-details">
      <div className="card-header">
        <div>
          <h3>Current State</h3>
          <small className="muted">
            Reconstructed by replaying {eventCount} immutable events (not read from a mutable row)
          </small>
        </div>
        {children}
      </div>

      <div className="shipment-info">
        {items.map(([label, value]) => (
          <div className="shipment-item" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ShipmentDetails;
