import { useEffect, useState } from "react";

import Header from "../Components/Header";
import {
  createShipment,
  getCurrentVersion,
  recordMovement,
  recordTemperature,
} from "../services/shipmentService";
import {
  formatDateTime,
  humanize,
  MOVE_STATUSES,
  validateShipmentId,
} from "../utils/format";

const CONTAINER_TYPES = ["DRY_20FT", "DRY_40FT", "REEFER", "TANK", "OPEN_TOP"];

const EMPTY_CREATE = { shipmentId: "", origin: "", destination: "", containerType: "REEFER" };
const EMPTY_MOVE = { status: "LOADED_ON_SHIP", location: "", carrier: "", notes: "" };
const EMPTY_TEMP = { temperature: "", unit: "C", threshold: "8", sensorId: "" };

/*
 * Command side (CQRS write model). Every command carries the version the user
 * loaded (expectedVersion). If another user appended an event in between,
 * the backend rejects it with 409 — Optimistic Concurrency Control (Week 4).
 */
function CommandCenterPage({ initialShipmentId, initialTab, onOpenShipment }) {
  const [tab, setTab] = useState(initialTab || (initialShipmentId ? "move" : "create"));
  const [idInput, setIdInput] = useState(initialShipmentId || "");
  const [loaded, setLoaded] = useState(null); // { shipmentId, version }
  const [loadState, setLoadState] = useState({ busy: false, error: "" });

  const [createForm, setCreateForm] = useState({ ...EMPTY_CREATE, shipmentId: initialShipmentId || "" });
  const [moveForm, setMoveForm] = useState(EMPTY_MOVE);
  const [tempForm, setTempForm] = useState(EMPTY_TEMP);
  const [staleDemo, setStaleDemo] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type, message }
  const [log, setLog] = useState([]);

  const loadShipment = async (rawId) => {
    const id = rawId.trim();
    const validation = validateShipmentId(id);
    if (validation) {
      setLoadState({ busy: false, error: validation });
      return;
    }

    setLoadState({ busy: true, error: "" });
    setFeedback(null);

    try {
      const version = await getCurrentVersion(id);
      if (version === 0) {
        setLoaded(null);
        setLoadState({ busy: false, error: `Shipment "${id}" does not exist yet — create it first.` });
        setCreateForm((form) => ({ ...form, shipmentId: id }));
        setTab("create");
        return;
      }
      setLoaded({ shipmentId: id, version, loadedAt: new Date().toISOString() });
      setLoadState({ busy: false, error: "" });
    } catch (error) {
      setLoadState({ busy: false, error: error.message });
    }
  };

  // Auto-load when opened from the audit page ("+ Record Event")
  useEffect(() => {
    if (!initialShipmentId || initialTab === "create") return undefined;
    let cancelled = false;
    getCurrentVersion(initialShipmentId)
      .then((version) => {
        if (!cancelled && version > 0) {
          setLoaded({ shipmentId: initialShipmentId, version, loadedAt: new Date().toISOString() });
        }
      })
      .catch((error) => !cancelled && setLoadState({ busy: false, error: error.message }));
    return () => {
      cancelled = true;
    };
  }, [initialShipmentId, initialTab]);

  const run = async (label, command) => {
    setSubmitting(true);
    setFeedback(null);

    try {
      const response = await command();
      const event = response.event;
      setLoaded({ shipmentId: event.shipmentId, version: event.version, loadedAt: new Date().toISOString() });
      setFeedback({
        type: "success",
        message: `${response.message}. Event ${event.eventType} stored as v${event.version}.`,
        shipmentId: event.shipmentId,
      });
      setLog((entries) => [{ ok: true, label, event, at: new Date().toISOString() }, ...entries].slice(0, 10));
      return true;
    } catch (error) {
      const conflict = error.status === 409;
      setFeedback({
        type: conflict ? "conflict" : "error",
        message: error.message,
      });
      setLog((entries) => [{ ok: false, label, message: error.message, at: new Date().toISOString() }, ...entries].slice(0, 10));
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const expectedVersion = loaded ? (staleDemo ? loaded.version - 1 : loaded.version) : null;

  const submitCreate = async (event) => {
    event.preventDefault();
    const data = {
      ...createForm,
      shipmentId: createForm.shipmentId.trim(),
      origin: createForm.origin.trim(),
      destination: createForm.destination.trim(),
    };
    const validation = validateShipmentId(data.shipmentId);
    if (validation) return setFeedback({ type: "error", message: validation });
    if (!data.origin || !data.destination) {
      return setFeedback({ type: "error", message: "Origin and destination are required." });
    }

    const ok = await run("Create shipment", () => createShipment(data));
    if (ok) {
      setIdInput(data.shipmentId);
      setCreateForm(EMPTY_CREATE);
      setTab("move");
    }
  };

  const submitMove = async (event) => {
    event.preventDefault();
    if (!moveForm.location.trim()) {
      return setFeedback({ type: "error", message: "Location is required." });
    }
    const ok = await run(`Move → ${humanize(moveForm.status)}`, () =>
      recordMovement({
        shipmentId: loaded.shipmentId,
        status: moveForm.status,
        location: moveForm.location.trim(),
        carrier: moveForm.carrier.trim() || undefined,
        notes: moveForm.notes.trim() || undefined,
        expectedVersion,
      })
    );
    if (ok) setMoveForm(EMPTY_MOVE);
  };

  const submitTemperature = async (event) => {
    event.preventDefault();
    const temperature = Number(tempForm.temperature);
    const threshold = tempForm.threshold === "" ? undefined : Number(tempForm.threshold);

    if (tempForm.temperature === "" || !Number.isFinite(temperature)) {
      return setFeedback({ type: "error", message: "Temperature must be a number." });
    }
    if (threshold !== undefined && !Number.isFinite(threshold)) {
      return setFeedback({ type: "error", message: "Threshold must be a number." });
    }

    const ok = await run(`Temperature ${temperature}°${tempForm.unit}`, () =>
      recordTemperature({
        shipmentId: loaded.shipmentId,
        temperature,
        unit: tempForm.unit,
        threshold,
        sensorId: tempForm.sensorId.trim() || undefined,
        expectedVersion,
      })
    );
    if (ok) setTempForm((form) => ({ ...form, temperature: "" }));
  };

  const needsLoaded = tab !== "create";

  return (
    <>
      <Header
        title="Record Events"
        subtitle="Command side (CQRS). Commands never overwrite data — each one appends a new immutable event."
      />

      <div className="command-layout">
        <section className="card">
          <div className="tabs" role="tablist">
            {[
              ["create", "Create Shipment"],
              ["move", "Record Movement"],
              ["temperature", "Record Temperature"],
            ].map(([id, label]) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={tab === id}
                className={`tab ${tab === id ? "active" : ""}`}
                onClick={() => {
                  setTab(id);
                  setFeedback(null);
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {needsLoaded && (
            <form
              className="load-bar"
              onSubmit={(event) => {
                event.preventDefault();
                loadShipment(idInput);
              }}
            >
              <input
                value={idInput}
                onChange={(event) => setIdInput(event.target.value)}
                placeholder="Shipment ID to append events to"
                aria-label="Shipment ID"
              />
              <button type="submit" className="btn dark" disabled={loadState.busy}>
                {loadState.busy ? "Loading…" : loaded ? "Reload version" : "Load"}
              </button>
            </form>
          )}

          {needsLoaded && loadState.error && <div className="alert error">{loadState.error}</div>}

          {needsLoaded && loaded && (
            <div className="version-banner">
              Editing <span className="mono">{loaded.shipmentId}</span> at{" "}
              <strong>v{loaded.version}</strong>
              <small> · loaded {formatDateTime(loaded.loadedAt)}</small>
              <label className="stale-toggle" title="Sends an outdated expectedVersion to demonstrate the 409 conflict">
                <input type="checkbox" checked={staleDemo} onChange={(event) => setStaleDemo(event.target.checked)} />
                Send stale version (OCC demo)
              </label>
            </div>
          )}

          {tab === "create" && (
            <form className="form-grid" onSubmit={submitCreate}>
              <label>
                Shipment / Container ID *
                <input value={createForm.shipmentId} onChange={(e) => setCreateForm({ ...createForm, shipmentId: e.target.value })} placeholder="e.g. MSKU7654321" />
              </label>
              <label>
                Container Type
                <select value={createForm.containerType} onChange={(e) => setCreateForm({ ...createForm, containerType: e.target.value })}>
                  {CONTAINER_TYPES.map((type) => (
                    <option key={type} value={type}>{humanize(type)}</option>
                  ))}
                </select>
              </label>
              <label>
                Origin *
                <input value={createForm.origin} onChange={(e) => setCreateForm({ ...createForm, origin: e.target.value })} placeholder="e.g. Delhi Warehouse" />
              </label>
              <label>
                Destination *
                <input value={createForm.destination} onChange={(e) => setCreateForm({ ...createForm, destination: e.target.value })} placeholder="e.g. Rotterdam" />
              </label>
              <div className="form-actions">
                <span className="muted">Appends <code>CONTAINER_CREATED</code> as v1</span>
                <button type="submit" className="btn primary" disabled={submitting}>
                  {submitting ? "Saving…" : "Create Shipment"}
                </button>
              </div>
            </form>
          )}

          {tab === "move" && loaded && (
            <form className="form-grid" onSubmit={submitMove}>
              <label>
                New Status *
                <select value={moveForm.status} onChange={(e) => setMoveForm({ ...moveForm, status: e.target.value })}>
                  {MOVE_STATUSES.map((status) => (
                    <option key={status} value={status}>{humanize(status)}</option>
                  ))}
                </select>
              </label>
              <label>
                Location *
                <input value={moveForm.location} onChange={(e) => setMoveForm({ ...moveForm, location: e.target.value })} placeholder="e.g. Mumbai Port (JNPT)" />
              </label>
              <label>
                Carrier
                <input value={moveForm.carrier} onChange={(e) => setMoveForm({ ...moveForm, carrier: e.target.value })} placeholder="e.g. Maersk Line" />
              </label>
              <label>
                Notes
                <input value={moveForm.notes} onChange={(e) => setMoveForm({ ...moveForm, notes: e.target.value })} placeholder="Optional" />
              </label>
              <div className="form-actions">
                <span className="muted">expectedVersion: <strong>{expectedVersion}</strong></span>
                <button type="submit" className="btn primary" disabled={submitting}>
                  {submitting ? "Saving…" : "Record Movement"}
                </button>
              </div>
            </form>
          )}

          {tab === "temperature" && loaded && (
            <form className="form-grid" onSubmit={submitTemperature}>
              <label>
                Temperature *
                <input type="number" step="0.1" value={tempForm.temperature} onChange={(e) => setTempForm({ ...tempForm, temperature: e.target.value })} placeholder="e.g. 11" />
              </label>
              <label>
                Unit
                <select value={tempForm.unit} onChange={(e) => setTempForm({ ...tempForm, unit: e.target.value })}>
                  <option value="C">°C</option>
                  <option value="F">°F</option>
                </select>
              </label>
              <label>
                Threshold
                <input type="number" step="0.1" value={tempForm.threshold} onChange={(e) => setTempForm({ ...tempForm, threshold: e.target.value })} placeholder="e.g. 8" />
              </label>
              <label>
                Sensor ID
                <input value={tempForm.sensorId} onChange={(e) => setTempForm({ ...tempForm, sensorId: e.target.value })} placeholder="e.g. SNS-44" />
              </label>
              <div className="form-actions">
                <span className="muted">expectedVersion: <strong>{expectedVersion}</strong></span>
                <button type="submit" className="btn primary" disabled={submitting}>
                  {submitting ? "Saving…" : "Record Reading"}
                </button>
              </div>
            </form>
          )}

          {needsLoaded && !loaded && !loadState.error && (
            <div className="empty-state small">Load a shipment to see its current version before appending events.</div>
          )}

          {feedback && feedback.type === "success" && (
            <div className="alert success">
              {feedback.message}
              <button type="button" className="btn ghost" onClick={() => onOpenShipment(feedback.shipmentId)}>
                View audit trail →
              </button>
            </div>
          )}

          {feedback && feedback.type === "error" && <div className="alert error">{feedback.message}</div>}

          {feedback && feedback.type === "conflict" && (
            <div className="alert warning">
              <div>
                <strong>Concurrency conflict (409).</strong> {feedback.message}
                <br />
                Someone else appended an event after you loaded this shipment. Your command was rejected
                so their change is not silently overwritten. Reload the latest version, review, then retry.
              </div>
              <button
                type="button"
                className="btn ghost"
                onClick={() => {
                  setStaleDemo(false);
                  loadShipment(loaded?.shipmentId || idInput);
                }}
              >
                Reload latest version
              </button>
            </div>
          )}
        </section>

        <aside className="card">
          <div className="card-header">
            <h3>Session Command Log</h3>
            <span>{log.length}</span>
          </div>

          {log.length === 0 ? (
            <div className="empty-state small">Commands you send will appear here.</div>
          ) : (
            <ul className="command-log">
              {log.map((entry) => (
                <li key={entry.at + entry.label} className={entry.ok ? "ok" : "fail"}>
                  <strong>{entry.ok ? "✓" : "✗"} {entry.label}</strong>
                  <small>
                    {entry.ok
                      ? `${entry.event.shipmentId} · v${entry.event.version}`
                      : entry.message}
                  </small>
                  <small>{formatDateTime(entry.at)}</small>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>
    </>
  );
}

export default CommandCenterPage;
