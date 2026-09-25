import { describeEvent, eventMeta, formatDateTime } from "../utils/format";

/*
 * Week 2 — vertical timeline of the RAW event stream (append-only log).
 * Events after the current rewind point are dimmed.
 */
function EventTimeline({ events, selectedVersion, onSelect }) {
  const ordered = [...events].sort((a, b) => a.version - b.version);

  return (
    <section className="card">
      <div className="card-header">
        <div>
          <h3>Immutable Event Log</h3>
          <small className="muted">
            Append-only · ordered by version · click an event to rewind to it
          </small>
        </div>
        <span className="lock-badge" title="Update/Delete are blocked in the Event Store">
          🔒 Read-only
        </span>
      </div>

      <ol className="event-log">
        {ordered.map((event) => {
          const meta = eventMeta(event);
          const isSelected = event.version === selectedVersion;
          const isFuture = event.version > selectedVersion;

          return (
            <li
              key={event._id || `${event.shipmentId}-${event.version}`}
              className={`log-item ${isSelected ? "selected" : ""} ${isFuture ? "future" : ""}`}
            >
              <span className={`log-dot tone-${meta.tone}`} aria-hidden="true">
                {meta.icon}
              </span>

              <button
                type="button"
                className="log-body"
                onClick={() => onSelect(event.version)}
                aria-pressed={isSelected}
              >
                <div className="log-title">
                  <span className="version-pill">v{event.version}</span>
                  <strong>{meta.label}</strong>
                  <code>{event.eventType}</code>
                </div>
                <time dateTime={new Date(event.timestamp).toISOString()}>
                  {formatDateTime(event.timestamp)}
                </time>
                {describeEvent(event) && <p>{describeEvent(event)}</p>}
              </button>

              <details className="payload">
                <summary>Payload</summary>
                <pre>{JSON.stringify(event.payload || {}, null, 2)}</pre>
              </details>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export default EventTimeline;
