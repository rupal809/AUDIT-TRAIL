
function Analytics() {

  return (
    <div className="page-content">

      <div className="page-title">
        <h1>Analytics</h1>
        <p>Shipment performance overview</p>
      </div>

      <section className="stats">

        <div className="stat-card">
          <h4>Total Shipments</h4>
          <h2>1,248</h2>
        </div>

        <div className="stat-card">
          <h4>Delivered</h4>
          <h2>356</h2>
        </div>

        <div className="stat-card">
          <h4>Delayed</h4>
          <h2>18</h2>
        </div>

      </section>

      <div className="card analytics-chart">

        <div className="card-header">
          <h3>Shipment Performance</h3>
          <span>This Week</span>
        </div>

        <div className="analytics-bars">

          <div className="analytics-bar">
            <div style={{ height: "65%" }}></div>
            <span>Mon</span>
          </div>

          <div className="analytics-bar">
            <div style={{ height: "80%" }}></div>
            <span>Tue</span>
          </div>

          <div className="analytics-bar">
            <div style={{ height: "55%" }}></div>
            <span>Wed</span>
          </div>

          <div className="analytics-bar">
            <div style={{ height: "90%" }}></div>
            <span>Thu</span>
          </div>

          <div className="analytics-bar">
            <div style={{ height: "70%" }}></div>
            <span>Fri</span>
          </div>

          <div className="analytics-bar">
            <div style={{ height: "85%" }}></div>
            <span>Sat</span>
          </div>

          <div className="analytics-bar">
            <div style={{ height: "75%" }}></div>
            <span>Sun</span>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Analytics;
