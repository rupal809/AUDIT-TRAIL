import React, { useState } from "react";
import "./RewindSlider.css";

function RewindSlider({ events = [] }) {
  const [selectedIndex, setSelectedIndex] = useState(events.length - 1);

  if (events.length === 0) {
    return null;
  }

  const selectedEvent = events[selectedIndex];

  const handleChange = (e) => {
    setSelectedIndex(Number(e.target.value));
  };

  return (
    <div className="rewind-slider">

      <h3>Shipment State Rewind</h3>

      <input
        type="range"
        min="0"
        max={events.length - 1}
        value={selectedIndex}
        onChange={handleChange}
        className="rewind-range"
      />

      <div className="rewind-events">
        {events.map((event, index) => (
          <span
            key={event.id || index}
            className={index === selectedIndex ? "active" : ""}
          >
            {event.eventType}
          </span>
        ))}
      </div>

      <div className="selected-state">

        <h4>State at Selected Time</h4>

        <p>
          <strong>Event:</strong> {selectedEvent.eventType}
        </p>

        <p>
          <strong>Time:</strong>{" "}
          {new Date(selectedEvent.timestamp).toLocaleString()}
        </p>

        {selectedEvent.location && (
          <p>
            <strong>Location:</strong> {selectedEvent.location}
          </p>
        )}

        {selectedEvent.description && (
          <p>
            <strong>Description:</strong> {selectedEvent.description}
          </p>
        )}

      </div>

    </div>
  );
}

export default RewindSlider;