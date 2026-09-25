
import { useState } from "react";

function Containers() {
  const [search, setSearch] = useState("");

  const containers = [
    {
      id: "MSKU1234567",
      location: "Mumbai Port",
      status: "Arrived",
    },
    {
      id: "TCLU7654321",
      location: "Arabian Sea",
      status: "In Transit",
    },
    {
      id: "HLBU9876543",
      location: "JNPT Port",
      status: "Loaded",
    },
    {
      id: "MSCU4567891",
      location: "Delhi",
      status: "Delayed",
    },
  ];

  const filteredContainers = containers.filter((container) =>
    container.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-content">

      <div className="page-title">
        <h1>Containers</h1>
        <p>Monitor and manage containers</p>
      </div>

      <section className="stats">

        <div className="stat-card">
          <h4>Total Containers</h4>
          <h2>1,248</h2>
        </div>

        <div className="stat-card">
          <h4>In Transit</h4>
          <h2>842</h2>
        </div>

        <div className="stat-card">
          <h4>Delayed</h4>
          <h2>18</h2>
        </div>

      </section>

      <div className="card container-search">
        <input
          type="text"
          placeholder="Search Container ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="card">

        <div className="card-header">
          <h3>Container List</h3>
        </div>

        <table className="container-table">

          <thead>
            <tr>
              <th>Container ID</th>
              <th>Location</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredContainers.map((container) => (
              <tr key={container.id}>
                <td>{container.id}</td>
                <td>{container.location}</td>
                <td>
                  <span className="container-status">
                    {container.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>

        </table>

        {filteredContainers.length === 0 && (
          <p className="no-results">
            No container found.
          </p>
        )}

      </div>

    </div>
  );
}

export default Containers;

