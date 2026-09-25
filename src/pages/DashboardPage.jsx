import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import Header from "../Components/Header";
import StatCard from "../Components/StatCard";
import { getDashboardSummary } from "../services/dashboardService";
import {
  eventMeta,
  formatDateTime,
  humanize,
  STATUS_COLORS,
} from "../utils/format";

function DashboardPage({ onOpenShipment, onNavigate }) {
  const [reloadKey, setReloadKey] = useState(0);
  const [result, setResult] = useState({ key: -1 });

  useEffect(() => {
    let cancelled = false;
    getDashboardSummary()
      .then((summary) => !cancelled && setResult({ key: reloadKey, summary }))
      .catch((error) => !cancelled && setResult({ key: reloadKey, error: error.message }));
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const loading = result.key !== reloadKey;
  const { summary, error } = result;

  const statusData = summary
    ? Object.entries(summary.statusCounts).map(([status, value]) => ({
        status,
        name: humanize(status),
        value,
      }))
    : [];

  const activityData = summary
    ? summary.activity.map((day) => ({
        ...day,
        label: new Date(`${day.date}T00:00:00`).toLocaleDateString(undefined, {
          weekday: "short",
          day: "numeric",
        }),
      }))
    : [];

  return (
    <>
      <Header
        title="Dashboard Overview"
        subtitle="Every figure below is computed by replaying the immutable event log."
      >
        <button type="button" className="btn ghost" onClick={() => setReloadKey((k) => k + 1)} disabled={loading}>
          ↻ Refresh
        </button>
        <button type="button" className="btn primary" onClick={() => onNavigate("commands")}>
          + New Shipment
        </button>
      </Header>

      {error && !loading && (
        <div className="alert error">
          {error}
          <button type="button" className="btn ghost" onClick={() => setReloadKey((k) => k + 1)}>Retry</button>
        </div>
      )}

      {loading && !summary && <div className="empty-state">Loading dashboard…</div>}

      {summary && (
        <>
          <section className="stats">
            <StatCard title="Total Shipments" value={summary.totals.shipments} hint={`${summary.totals.events} immutable events stored`} icon="📦" />
            <StatCard title="In Transit" value={summary.totals.inTransit} hint="Truck, ship or moving" icon="🚢" />
            <StatCard title="At Port / Delivered" value={summary.totals.atPort + summary.totals.delivered} hint={`${summary.totals.atPort} at port · ${summary.totals.delivered} delivered`} icon="⚓" />
            <StatCard
              title="Temperature Alerts"
              value={summary.totals.activeAlerts}
              hint="Latest reading above threshold"
              icon="🌡️"
              tone={summary.totals.activeAlerts ? "danger" : "default"}
            />
          </section>

          <section className="charts">
            <div className="card">
              <div className="card-header">
                <h3>Container Status</h3>
                <span>Current (replayed)</span>
              </div>

              {statusData.length === 0 ? (
                <div className="empty-state small">No shipments yet.</div>
              ) : (
                <div className="donut-container">
                  <div className="donut-chart">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={52} outerRadius={75} paddingAngle={2} isAnimationActive={false}>
                          {statusData.map((entry) => (
                            <Cell key={entry.status} fill={STATUS_COLORS[entry.status] || STATUS_COLORS.UNKNOWN} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="donut-center">
                      <strong>{summary.totals.shipments}</strong>
                      <small>Total</small>
                    </div>
                  </div>

                  <div className="legend">
                    {statusData.map((entry) => (
                      <p key={entry.status}>
                        <span className="dot" style={{ background: STATUS_COLORS[entry.status] || STATUS_COLORS.UNKNOWN }} />
                        {entry.name} <strong>{entry.value}</strong>
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="card">
              <div className="card-header">
                <h3>Event Activity</h3>
                <span>7 days to {activityData.at(-1)?.date}</span>
              </div>
              <div className="bar-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activityData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke="#eef0f5" />
                    <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#8992a2" }} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#8992a2" }} axisLine={false} tickLine={false} />
                    <Tooltip formatter={(value) => [value, "Events"]} />
                    <Bar dataKey="count" fill="#635bff" radius={[5, 5, 0, 0]} isAnimationActive={false} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          <section className="bottom-grid">
            <div className="card">
              <div className="card-header">
                <h3>Active Temperature Alerts</h3>
                <span>{summary.alerts.length} open</span>
              </div>

              {summary.alerts.length === 0 ? (
                <div className="empty-state small">No active temperature alerts. 🎉</div>
              ) : (
                summary.alerts.map((alert) => (
                  <button type="button" className="row-link alert-row" key={alert.shipmentId} onClick={() => onOpenShipment(alert.shipmentId)}>
                    <div>
                      <span className="status-dot danger" />
                      <span className="mono">{alert.shipmentId}</span>
                      <small>{alert.location || "Unknown location"}</small>
                    </div>
                    <strong>
                      {alert.temperature}°{alert.temperatureUnit || "C"}
                      {alert.threshold !== null && alert.threshold !== undefined ? ` / ${alert.threshold}°` : ""}
                    </strong>
                  </button>
                ))
              )}
            </div>

            <div className="card">
              <div className="card-header">
                <h3>Recent Events</h3>
                <span>Latest {summary.recentEvents.length}</span>
              </div>

              <div className="timeline">
                {summary.recentEvents.map((event) => {
                  const meta = eventMeta(event);
                  return (
                    <button
                      type="button"
                      className="event row-link"
                      key={`${event.shipmentId}-${event.version}`}
                      onClick={() => onOpenShipment(event.shipmentId)}
                    >
                      <div className={`event-dot tone-${meta.tone}`} />
                      <div>
                        <h4>{meta.label}</h4>
                        <p>
                          <span className="mono">{event.shipmentId}</span> · v{event.version} · {formatDateTime(event.timestamp)}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
}

export default DashboardPage;
