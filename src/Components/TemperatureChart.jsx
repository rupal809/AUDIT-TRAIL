import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const temperatureData = [
  {
    eventType: "CONTAINER_CREATED",
    timestamp: "2026-09-01T08:00:00Z",
    temperature: 22
  },
  {
    eventType: "LOADED_ON_TRUCK",
    timestamp: "2026-09-01T12:00:00Z",
    temperature: 23
  },
  {
    eventType: "TEMPERATURE_SPIKE",
    timestamp: "2026-09-02T10:30:00Z",
    temperature: 31
  },
  {
    eventType: "ARRIVED_AT_PORT",
    timestamp: "2026-09-03T16:00:00Z",
    temperature: 25
  }
];

function TemperatureChart() {
  return (
    <div style={{ width: "100%", height: "350px" }}>
      <h2>Temperature Fluctuation</h2>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={temperatureData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="timestamp"
            tickFormatter={(value) =>
              new Date(value).toLocaleDateString()
            }
          />

          <YAxis
            label={{
              value: "Temperature (°C)",
              angle: -90,
              position: "insideLeft"
            }}
          />

          <Tooltip
            labelFormatter={(value) =>
              new Date(value).toLocaleString()
            }
            formatter={(value) => [`${value} °C`, "Temperature"]}
          />

          <Line
            type="monotone"
            dataKey="temperature"
            strokeWidth={3}
            dot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default TemperatureChart;