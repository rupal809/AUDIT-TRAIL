function Header() {
  return (
    <header className="header">

      <div>
        <h1>Dashboard Overview</h1>
        <p>
          Monitor your logistics operations and audit events.
        </p>
      </div>

      <div className="header-actions">

        <button className="date-btn">
          📅 Today
        </button>

        <button className="export-btn">
          Export Report
        </button>

        <span className="notification">
          🔔
        </span>

      </div>

    </header>
  );
}

export default Header;