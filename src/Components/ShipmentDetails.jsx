function ShipmentDetails({ shipment }) {
  if (!shipment) {
    return null;
  }

  return (
    <section className="shipment-details card">
      <div className="card-header">
        <h3>Shipment Details</h3>
      </div>

      <div className="shipment-info">
        <div>
          <span>Shipment ID</span>
          <strong>{shipment.id}</strong>
        </div>

        <div>
          <span>Current Status</span>
          <strong>{shipment.status}</strong>
        </div>

        <div>
          <span>Current Location</span>
          <strong>{shipment.location}</strong>
        </div>

        <div>
          <span>Version</span>
          <strong>{shipment.version}</strong>
        </div>

        <div>
          <span>Last Event</span>
          <strong>{shipment.lastEvent}</strong>
        </div>

        <div>
          <span>Last Updated</span>
          <strong>{shipment.lastUpdated}</strong>
        </div>
      </div>
    </section>
  );
}

export default ShipmentDetails;