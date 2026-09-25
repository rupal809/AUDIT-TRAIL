function Alerts() {

const alerts = [
{
type: "Temperature Spike",
container: "TCLU7654321",
},
{
type: "Shipment Delayed",
container: "MSKU1234567",
},
{
type: "Location Issue",
container: "HLBU9876543",
},
];

return (
<div className="page-content">

  <div className="page-title">
    <h1>Alerts</h1>
    <p>Monitor active shipment and container alerts</p>
  </div>

  <div className="card">

    <div className="card-header">
      <h3>Active Alerts</h3>
      <strong>{alerts.length}</strong>
    </div>

    <div className="alerts-list">

      {alerts.map((alert, index) => (

        <div className="alert-row" key={index}>

          <div className="alert-icon">
            ⚠
          </div>

          <div className="alert-info">

            <h4>{alert.type}</h4>

            <p>
              Container: {alert.container}
            </p>

          </div>

        </div>

      ))}

    </div>

  </div>

</div>

);
}

export default Alerts;