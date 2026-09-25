<<<<<<< HEAD
function Sidebar({ activePage, setActivePage }) {
  const menuItems = [
    "Dashboard",
    "Containers",
    "Shipments",
    "Analytics",
    "Alerts",
    "Settings",
  ];

=======
import { USE_MOCK_DATA, API_BASE_URL } from "../services/api";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "▦" },
  { id: "audit", label: "Shipment Audit", icon: "⧗" },
  { id: "commands", label: "Record Events", icon: "✎" },
];

function Sidebar({ page, onNavigate }) {
>>>>>>> 9ea4487eb1a71343cb6e29bd1ef569e5cb42b204
  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-icon">A</div>
        <h2>AuditTrail</h2>
      </div>

      <div className="user">
        <div className="avatar">LM</div>
        <div>
          <h4>Manager</h4>
          <p>Logistics Manager</p>
        </div>
      </div>

<<<<<<< HEAD
      <nav>
        {menuItems.map((item) => (
          <a
            key={item}
            className={activePage === item ? "active" : ""}
            onClick={() => setActivePage(item)}
          >
            {item}
          </a>
=======
      <nav aria-label="Main navigation">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`nav-item ${page === item.id ? "active" : ""}`}
            aria-current={page === item.id ? "page" : undefined}
            onClick={() => onNavigate(item.id)}
          >
            <span className="nav-icon" aria-hidden="true">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
>>>>>>> 9ea4487eb1a71343cb6e29bd1ef569e5cb42b204
        ))}
      </nav>

      <div className="sidebar-footer">
        <span className={`mode-dot ${USE_MOCK_DATA ? "mock" : "live"}`} />
        <div>
          <strong>{USE_MOCK_DATA ? "Mock data" : "Live API"}</strong>
          <small>{USE_MOCK_DATA ? "In-memory event store" : API_BASE_URL}</small>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
