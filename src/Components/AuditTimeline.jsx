function AuditTimeline({ events }) {
  if (!events || events.length === 0) {
    return (
      <div className="empty-timeline">
        No audit events available.
      </div>
    );
  }

  return (
    <div className="audit-timeline">

      {events.map((event) => (
        <div
          className="audit-event"
          key={`${event.version}-${event.eventType}`}
        >

          <div className="timeline-marker">
            <span>{event.version}</span>
          </div>

          <div className="timeline-line"></div>

          <div className="timeline-content">

            <div className="timeline-header">
              <h4>{formatEventName(event.eventType)}</h4>

              <span className="event-version">
                Version {event.version}
              </span>
            </div>

            <p className="timeline-date">
              {formatDate(event.timestamp)}
            </p>

            {event.payload && (
              <div className="event-payload">

                {Object.entries(event.payload).map(
                  ([key, value]) => (
                    <div
                      className="payload-item"
                      key={key}
                    >
                      <span>{formatEventName(key)}</span>

                      <strong>{value}</strong>
                    </div>
                  )
                )}

              </div>
            )}

          </div>

        </div>
      ))}

    </div>
  );
}




function formatEventName(value) {
  if (!value) return "";

  return value
    .toLowerCase()
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
}



function formatDate(timestamp) {
  if (!timestamp) return "";

  return new Date(timestamp).toLocaleString();
}


export default AuditTimeline;