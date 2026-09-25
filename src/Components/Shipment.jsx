
function Shipments() {

  const shipments = [
    {
      id: "SHP001",
      origin: "Mumbai",
      destination: "Delhi",
      status: "In Transit",
    },
    {
      id: "SHP002",
      origin: "Chennai",
      destination: "Pune",
      status: "Delivered",
    },
    {
      id: "SHP003",
      origin: "Delhi",
      destination: "Mumbai",
      status: "Delayed",
    },
    {
      id: "SHP004",
      origin: "Kolkata",
      destination: "Bangalore",
      status: "In Transit",
    },
  ];

  return (
    <div className="page-content">

      <div className="page-title">
        <h1>Shipments</h1>
        <p>Track shipment status and routes</p>
      </div>

      <div className="card">

        <div className="card-header">
          <h3>Shipment List</h3>
        </div>

        <table className="container-table">

          <thead>
            <tr>
              <th>Shipment ID</th>
              <th>Origin</th>
              <th>Destination</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>

            {shipments.map((shipment) => (
              <tr key={shipment.id}>

                <td>{shipment.id}</td>

                <td>{shipment.origin}</td>

                <td>{shipment.destination}</td>

                <td>
                  <span className="container-status">
                    {shipment.status}
                  </span>
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Shipments;

