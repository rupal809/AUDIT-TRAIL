function Sidebar({ activePage, setActivePage }) {
  const menuItems = [
    "Dashboard",
    "Containers",
    "Shipments",
    "Analytics",
    "Alerts",
    "Settings",
  ];

  return (
    <aside className="sidebar">

      <div className="logo">
        <div className="logo-icon">A</div>
        <h2>AuditTrail</h2>
      </div>

      <div className="user">
        <div className="avatar">G</div>

        <div>
          <h4>Manager</h4>
          <p>Logistics Manager</p>
        </div>
      </div>

      <nav>
        {menuItems.map((item) => (
          <a
            key={item}
            className={activePage === item ? "active" : ""}
            onClick={() => setActivePage(item)}
          >
            {item}
          </a>
        ))}
      </nav>

      <div className="logout">
        ↪ Logout
      </div>

    </aside>
  );
}

export default Sidebar;