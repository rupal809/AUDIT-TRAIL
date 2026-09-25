import { humanize, STATUS_COLORS } from "../utils/format";

function StatusBadge({ status }) {
  const color = STATUS_COLORS[status] || STATUS_COLORS.UNKNOWN;

  return (
    <span
      className="status-badge"
      style={{ color, background: `${color}1a`, borderColor: `${color}55` }}
    >
      {humanize(status)}
    </span>
  );
}

export default StatusBadge;
