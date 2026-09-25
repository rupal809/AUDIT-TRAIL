import { useEffect, useMemo, useState } from "react";
import StatusBadge from "./StatusBadge";
import { replayEvents } from "../utils/shipmentReducer";
import { eventMeta, formatDateTime, humanize } from "../utils/format";
import { getStateAtVersion } from "../services/shipmentService";
import { USE_MOCK_DATA } from "../services/api";

const COMPARED_FIELDS = [
  "status",
  "location",
  "carrier",
  "temperature",
  "temperatureAlert",
  "version",
];

const toLocalInput = (value) => {
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
};

const STATE_ROWS = [
  ["status", "Status"],
  ["location", "Location"],
  ["carrier", "Carrier"],
  ["temperature", "Temperature"],
  ["temperatureAlert", "Temperature Alert"],
  ["lastEvent", "Last Event"],
];

const renderValue = (key, state) => {
  const value = state?.[key];
  if (key === "status") return <StatusBadge status={value} />;
  if (key === "temperature") {
    return value === undefined || value === null
      ? "—"
      : `${value}°${state.temperatureUnit || "C"}`;
  }
  if (key === "temperatureAlert") return value ? "⚠ Yes" : "No";
  if (key === "lastEvent") return humanize(value);
  return value || "—";
};

/*
 * Week 3 — State scrubbing: rewind time and view the shipment's state
 * as it existed after any event (or at any date/time).
 */
function RewindSlider({ shipmentId, events, version, onChange }) {
  const ordered = useMemo(
    () => [...events].sort((a, b) => a.version - b.version),
    [events]
  );
  const [timeError, setTimeError] = useState("");
  const [serverCheck, setServerCheck] = useState({ version: null });

  const index = Math.max(0, ordered.findIndex((e) => e.version === version));
  const selectedEvent = ordered[index];

  const state = useMemo(() => replayEvents(ordered, version), [ordered, version]);
  const previous = useMemo(
    () => (version > 1 ? replayEvents(ordered, version - 1) : null),
    [ordered, version]
  );

  // Reconstruction check: compare local fold with the backend's replay
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      getStateAtVersion(shipmentId, version)
        .then((serverState) => {
          if (cancelled) return;
          const mismatched = COMPARED_FIELDS.filter(
            (field) => (serverState?.[field] ?? null) !== (state?.[field] ?? null)
          );
          setServerCheck({ version, mismatched, error: "" });
        })
        .catch((error) => {
          if (!cancelled) {
            setServerCheck({ version, mismatched: [], error: error.message });
          }
        });
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [shipmentId, version, state]);

  if (!ordered.length || !selectedEvent) {
    return null;
  }

  const handleTimeJump = (value) => {
    if (!value) return;
    const target = new Date(value).getTime();
    const candidates = ordered.filter(
      (event) => new Date(event.timestamp).getTime() <= target
    );

    if (!candidates.length) {
      setTimeError("The shipment did not exist yet at that time.");
      return;
    }

    setTimeError("");
    onChange(candidates[candidates.length - 1].version);
  };

  const changed = (key) =>
    previous !== null && (previous?.[key] ?? null) !== (state?.[key] ?? null);

  const isLatest = index === ordered.length - 1;
  const meta = eventMeta(selectedEvent);
  const checking = serverCheck.version !== version;

  return (
    <section className="card rewind-slider">
      <div className="card-header">
        <div>
          <h3>Shipment State Rewind</h3>
          <small className="muted">
            State after event {index + 1} of {ordered.length}
            {isLatest ? " (current)" : " (historical)"}
          </small>
        </div>

        <div className="rewind-buttons">
          <button type="button" className="btn ghost" onClick={() => onChange(ordered[0].version)} disabled={index === 0} aria-label="First event">⏮</button>
          <button type="button" className="btn ghost" onClick={() => onChange(ordered[index - 1].version)} disabled={index === 0} aria-label="Previous event">◀</button>
          <button type="button" className="btn ghost" onClick={() => onChange(ordered[index + 1].version)} disabled={isLatest} aria-label="Next event">▶</button>
          <button type="button" className="btn ghost" onClick={() => onChange(ordered[ordered.length - 1].version)} disabled={isLatest}>Latest</button>
        </div>
      </div>

      <input
        type="range"
        min="0"
        max={ordered.length - 1}
        value={index}
        onChange={(event) => onChange(ordered[Number(event.target.value)].version)}
        className="rewind-range"
        aria-label="Rewind through shipment events"
        style={{ "--progress": `${ordered.length > 1 ? (index / (ordered.length - 1)) * 100 : 100}%` }}
      />

      <div className="rewind-ticks">
        <span>{formatDateTime(ordered[0].timestamp)}</span>
        <span>{formatDateTime(ordered[ordered.length - 1].timestamp)}</span>
      </div>

      <label className="time-jump">
        <span>View state as of</span>
        <input
          type="datetime-local"
          value={toLocalInput(selectedEvent.timestamp)}
          onChange={(event) => handleTimeJump(event.target.value)}
        />
      </label>
      {timeError && <p className="inline-error">{timeError}</p>}

      <div className="selected-event">
        <span className={`log-dot tone-${meta.tone}`}>{meta.icon}</span>
        <div>
          <strong>{meta.label}</strong>
          <small>v{selectedEvent.version} · {formatDateTime(selectedEvent.timestamp)}</small>
        </div>
      </div>

      <table className="state-table">
        <tbody>
          {STATE_ROWS.map(([key, label]) => (
            <tr key={key} className={changed(key) ? "changed" : ""}>
              <th scope="row">{label}</th>
              <td>
                {renderValue(key, state)}
                {changed(key) && <span className="changed-tag">changed</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div
        className={`verify-line ${
          checking ? "" : serverCheck.error || serverCheck.mismatched.length ? "bad" : "good"
        }`}
      >
        {checking && "Verifying against server replay…"}
        {!checking && serverCheck.error && `Server replay unavailable: ${serverCheck.error}`}
        {!checking && !serverCheck.error && serverCheck.mismatched.length === 0 &&
          `✓ Matches ${USE_MOCK_DATA ? "mock" : "backend"} replay (/replay/${shipmentId}/state?version=${version})`}
        {!checking && !serverCheck.error && serverCheck.mismatched.length > 0 &&
          `✗ Differs from backend replay on: ${serverCheck.mismatched.join(", ")}`}
      </div>
    </section>
  );
}

export default RewindSlider;
