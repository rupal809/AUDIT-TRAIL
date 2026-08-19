import { useState } from "react";
import "./App.css";

function App() {
  const [shipmentId, setShipmentId] = useState("");
  const [searchedShipment, setSearchedShipment] = useState(null);


  const handleSearch = () => {
  if (!shipmentId.trim()) {
    setSearchedShipment(null);
    return;
  }

  // Temporary mock result
  setSearchedShipment({
    id: shipmentId,
    status: "Arrived at Port",
    location: "Mumbai Port",
    version: 4,
    lastEvent: "ARRIVED_AT_PORT",
    lastUpdated: "10:30 AM",
  });
};



  const stats = [
    {
      title: "Total Containers",
      value: "1,248",
      change: "+12.4%",
      icon: "📦",
    },
    {
      title: "In Transit",
      value: "842",
      change: "+8.7%",
      icon: "🚢",
    },
    {
      title: "Delivered",
      value: "356",
      change: "+15.3%",
      icon: "✓",
    },
    {
      title: "Active Alerts",
      value: "23",
      change: "+5",
      icon: "⚠",
    },
  ];

  const events = [
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

  return (
    <div className="app">

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-icon">A</div>
          <h2>AuditTrail</h2>
        </div>

        <div className="user">
          <div className="avatar">G</div>
          <div>
            <h4>Manager</h4>
            <p>Logistics Manager</p>
          </div>
        </div>

        <nav>
          <a className="active"> Dashboard</a>
          <a> Containers</a>
          <a> Shipments</a>
          <a> Analytics</a>
          <a> Alerts</a>
          <a> Settings</a>
        </nav>

        <div className="logout">
          ↪ Logout
        </div>
      </aside>

      {/* Main */}
      <main className="main">

        {/* Header */}
        <header className="header">
          <div>
            <h1>Dashboard Overview</h1>
            <p>Monitor your logistics operations and audit events.</p>
          </div>

          <div className="header-actions">
            <button className="date-btn">📅 Today</button>
            <button className="export-btn">Export Report</button>
            <span className="notification">🔔</span>
          </div>
        </header>

        {/* Search */}
      <div className="search-section">

  <input
    type="text"
    placeholder="Enter Shipment ID..."
    value={shipmentId}
    onChange={(e) => setShipmentId(e.target.value)}
  />

  <button onClick={handleSearch}>
    Search
   </button>

    </div>
    {searchedShipment && (
  <section className="shipment-details card">
    <div className="card-header">
      <h3>Shipment Details</h3>
    </div>

    <div className="shipment-info">
      <div>
        <span>Shipment ID</span>
        <strong>{searchedShipment.id}</strong>
      </div>

      <div>
        <span>Current Status</span>
        <strong>{searchedShipment.status}</strong>
      </div>

      <div>
        <span>Current Location</span>
        <strong>{searchedShipment.location}</strong>
      </div>

      <div>
        <span>Version</span>
        <strong>{searchedShipment.version}</strong>
      </div>

      <div>
        <span>Last Event</span>
        <strong>{searchedShipment.lastEvent}</strong>
      </div>

      <div>
        <span>Last Updated</span>
        <strong>{searchedShipment.lastUpdated}</strong>
      </div>
    </div>
  </section>
)}

        {/* Stats */}
        <section className="stats">
          {stats.map((stat) => (
            <div className="stat-card" key={stat.title}>
              <div className="stat-top">
                <span>{stat.title}</span>
                <div className="stat-icon">{stat.icon}</div>
              </div>

              <h2>{stat.value}</h2>
              <p className="positive">
                ↑ {stat.change} <span>vs last week</span>
              </p>
            </div>
          ))}
        </section>

        {/* Charts */}
        <section className="charts">

          <div className="card">
            <div className="card-header">
              <h3>Container Status</h3>
              <span>This Week ▾</span>
            </div>

            <div className="donut-container">
              <div className="donut">
                <div className="donut-center">
                  <strong>1,248</strong>
                  <small>Total</small>
                </div>
              </div>

              <div className="legend">
                <p>
                  <span className="dot blue"></span>
                  In Transit <strong>842</strong>
                </p>
                <p>
                  <span className="dot green"></span>
                  Delivered <strong>356</strong>
                </p>
                <p>
                  <span className="dot orange"></span>
                  At Port <strong>32</strong>
                </p>
                <p>
                  <span className="dot red"></span>
                  Delayed <strong>18</strong>
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3>Shipment Overview</h3>
              <span>This Week ▾</span>
            </div>

            <div className="bar-chart">
              <div className="bars">
                <div style={{ height: "45%" }}></div>
                <div style={{ height: "65%" }}></div>
                <div style={{ height: "52%" }}></div>
                <div style={{ height: "80%" }}></div>
                <div style={{ height: "70%" }}></div>
                <div style={{ height: "90%" }}></div>
                <div style={{ height: "75%" }}></div>
              </div>

              <div className="days">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>
          </div>

        </section>

        {/* Bottom section */}
        <section className="bottom-grid">

          <div className="card delayed">
            <div className="card-header">
              <h3>Top Delayed Containers</h3>
              <span className="view">View all</span>
            </div>

            {[
              ["MSKU1234567", "2.4 days delay"],
              ["TCLU7654321", "1.8 days delay"],
              ["HLBU9876543", "1.2 days delay"],
              ["CMAU1122334", "0.9 days delay"],
            ].map(([id, delay]) => (
              <div className="delayed-row" key={id}>
                <div>
                  <span className="status-dot"></span>
                  {id}
                </div>
                <strong>{delay}</strong>
              </div>
            ))}
          </div>

          <div className="card">
            <div className="card-header">
              <h3>Recent Events</h3>
              <span className="view">View all</span>
            </div>

            <div className="timeline">
              {events.map((event) => (
                <div className="event" key={event.id}>
                  <div className={`event-dot ${event.type}`}></div>

                  <div>
                    <h4>{event.title}</h4>
                    <p>
                      {event.id} · {event.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </section>

      </main>
    </div>
  );
}

export default App;