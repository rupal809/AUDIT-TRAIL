
import React from "react";
import "./ShipmentTimeline.css";

function ShipmentTimeline({ events = [] }) {
  return (
    <div className="shipment-timeline">
      <h2>Shipment Event Timeline</h2>

      {events.length === 0 ? (
        <p className="no-events">No events available.</p>
      ) : (
        <div className="timeline">
          {[...events]
            .sort(
              (a, b) =>
                new Date(a.timestamp) - new Date(b.timestamp)
            )
            .map((event, index) => (
              <div
                className="timeline-item"
                key={event.id || index}
              >
                <div className="timeline-dot"></div>

                <div className="timeline-content">
                  <h3>{event.eventType}</h3>

                  <p>
                    {new Date(event.timestamp).toLocaleString()}
                  </p>

                  {event.location && (
                    <span>
                      Location: {event.location}
                    </span>
                  )}

                  {event.description && (
                    <span>{event.description}</span>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default ShipmentTimeline;
