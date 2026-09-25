import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { eventMeta, formatDateTime } from "../utils/format";

const shortDate = (value) =>
  new Date(value).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

function SpikeDot({ cx, cy, payload }) {
  if (cx === undefined || cy === undefined) return null;
  return (
    <circle
      cx={cx}
      cy={cy}
      r={payload.isSpike ? 7 : 5}
      fill={payload.isSpike ? "#ef4444" : "#4d7cff"}
      stroke="#fff"
      strokeWidth={2}
    />
  );
}

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;

  return (
    <div className="chart-tooltip">
      <strong>
        {point.temperature}°{point.unit}
        {point.isSpike ? " — SPIKE" : ""}
      </strong>
      <span>{formatDateTime(point.time)}</span>
      <span>
        v{point.version}
        {point.threshold !== null ? ` · threshold ${point.threshold}°${point.unit}` : ""}
        {point.sensorId ? ` · ${point.sensorId}` : ""}
      </span>
    </div>
  );
}

/*
 * Week 4 — Recharts: sensor temperature plotted over the event timeline.
 * Grey dashed lines = lifecycle events, purple line = current rewind point.
 */
function TemperatureChart({ events, selectedVersion }) {
  const ordered = [...events].sort((a, b) => a.version - b.version);

  const readings = ordered
    .filter((event) => event.eventType === "TEMPERATURE_SPIKE")
    .map((event) => ({
      time: new Date(event.timestamp).getTime(),
      temperature: event.payload?.temperature,
      unit: event.payload?.unit || "C",
      threshold: event.payload?.threshold ?? null,
      sensorId: event.payload?.sensorId,
      isSpike: event.payload?.isSpike === true,
      version: event.version,
    }));

  const lifecycle = ordered.filter((event) => event.eventType !== "TEMPERATURE_SPIKE");
  const selectedEvent = ordered.find((event) => event.version === selectedVersion);
  const threshold = [...readings].reverse().find((r) => r.threshold !== null)?.threshold;
  const spikes = readings.filter((r) => r.isSpike).length;

  const times = ordered.map((event) => new Date(event.timestamp).getTime());
  const min = Math.min(...times);
  const max = Math.max(...times);
  const pad = Math.max((max - min) * 0.04, 60 * 60 * 1000);

  return (
    <section className="card">
      <div className="card-header">
        <div>
          <h3>Temperature Fluctuation</h3>
          <small className="muted">
            {readings.length} sensor readings · {spikes} spike{spikes === 1 ? "" : "s"} above threshold
          </small>
        </div>
        <div className="chart-legend">
          <span><i className="dot blue" /> Reading</span>
          <span><i className="dot red" /> Spike</span>
          <span><i className="dash" /> Threshold</span>
        </div>
      </div>

      {readings.length === 0 ? (
        <div className="empty-state small">
          No temperature readings recorded for this shipment yet.
        </div>
      ) : (
        <div className="chart-box">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={readings} margin={{ top: 28, right: 24, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8ebf2" />
              <XAxis
                dataKey="time"
                type="number"
                scale="time"
                domain={[min - pad, max + pad]}
                tickFormatter={shortDate}
                tick={{ fontSize: 11, fill: "#7b8495" }}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#7b8495" }}
                unit="°"
                width={48}
              />
              <Tooltip content={<ChartTooltip />} />

              {lifecycle.map((event) => (
                <ReferenceLine
                  key={`life-${event.version}`}
                  x={new Date(event.timestamp).getTime()}
                  stroke="#cbd5e1"
                  strokeDasharray="2 4"
                  label={{ value: eventMeta(event).icon, position: "top", fontSize: 14 }}
                />
              ))}

              {threshold !== undefined && (
                <ReferenceLine
                  y={threshold}
                  stroke="#ef4444"
                  strokeDasharray="6 4"
                  ifOverflow="extendDomain"
                  label={{ value: `Threshold ${threshold}°`, position: "insideTopRight", fill: "#ef4444", fontSize: 11 }}
                />
              )}

              {selectedEvent && (
                <ReferenceLine
                  x={new Date(selectedEvent.timestamp).getTime()}
                  stroke="#635bff"
                  strokeWidth={2}
                  label={{ value: "Rewind point", position: "insideTopLeft", fill: "#635bff", fontSize: 11 }}
                />
              )}

              <Line
                type="monotone"
                dataKey="temperature"
                stroke="#4d7cff"
                strokeWidth={3}
                dot={<SpikeDot />}
                activeDot={{ r: 8 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}

export default TemperatureChart;
