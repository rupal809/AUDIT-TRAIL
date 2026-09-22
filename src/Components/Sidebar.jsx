function Sidebar() {
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
        <a className="active">Dashboard</a>
        <a>Containers</a>
        <a>Shipments</a>
        <a>Analytics</a>
        <a>Alerts</a>
        <a>Settings</a>
      </nav>

      <div className="logout">
        ↪ Logout
      </div>

    </aside>
  );
}

export default Sidebar;