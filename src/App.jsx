
import { useState } from "react";
import "./App.css";

import Header from "./Components/Header";
import SearchBar from "./Components/SearchBar";
import Sidebar from "./Components/Sidebar";
import StatCard from "./Components/StatCard";
import ShipmentDetails from "./Components/ShipmentDetails";
import ShipmentTimeline from "./Components/ShipmentTimeline";

import {
  stats,
  events,
  delayedContainers,
} from "./Data/dashboardData";

import { getShipmentById } from "./services/shipmentService";

function App() {
  const [shipmentId, setShipmentId] = useState("");
  const [searchedShipment, setSearchedShipment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    const id = shipmentId.trim();

    if (!id) {
      setError("Please enter a Shipment ID");
      setSearchedShipment(null);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSearchedShipment(null);

      const shipment = await getShipmentById(id);

      setSearchedShipment(shipment);
    } catch (err) {
      setError(err.message || "Shipment not found");
      setSearchedShipment(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">

      <Sidebar />

      <main className="main">

        <Header />

        {/* Search */}
        <SearchBar
          shipmentId={shipmentId}
          setShipmentId={setShipmentId}
          onSearch={handleSearch}
          loading={loading}
        />

        {/* Search Error */}
        {error && (
          <div className="search-error">
            {error}
          </div>
        )}

        {/* Shipment Details */}
        <ShipmentDetails
          shipment={searchedShipment}
        />

        {/* Shipment Timeline */}
        {searchedShipment && searchedShipment.events && (
          <ShipmentTimeline
            events={searchedShipment.events}
          />
        )}

        {/* Stats */}
        <section className="stats">

          {stats.map((stat) => (
            <StatCard
              key={stat.title}
              {...stat}
            />
          ))}

        </section>

        {/* Charts */}
        <section className="charts">

          {/* Container Status */}
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

          {/* Shipment Overview */}
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

        {/* Bottom Section */}
        <section className="bottom-grid">

          {/* Delayed Containers */}
          <div className="card delayed">

            <div className="card-header">
              <h3>Top Delayed Containers</h3>
              <span className="view">View all</span>
            </div>

            {delayedContainers.map(([id, delay]) => (

              <div
                className="delayed-row"
                key={id}
              >

                <div>
                  <span className="status-dot"></span>
                  {id}
                </div>

                <strong>{delay}</strong>

              </div>

            ))}

          </div>

          {/* Recent Events */}
          <div className="card">

            <div className="card-header">
              <h3>Recent Events</h3>
              <span className="view">View all</span>
            </div>

            <div className="timeline">

              {events.map((event) => (

                <div
                  className="event"
                  key={event.id}
                >

                  <div
                    className={`event-dot ${event.type}`}
                  ></div>

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
```
