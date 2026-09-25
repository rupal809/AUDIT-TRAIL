import { useState } from "react";
import "./App.css";

import Sidebar from "./Components/Sidebar";
import DashboardPage from "./pages/DashboardPage";
import ShipmentAuditPage from "./pages/ShipmentAuditPage";
import CommandCenterPage from "./pages/CommandCenterPage";

function App() {
  const [page, setPage] = useState("dashboard");
  const [activeShipmentId, setActiveShipmentId] = useState("");
  const [commandContext, setCommandContext] = useState({
    id: "",
    tab: "",
    nonce: 0,
  });

  const openShipment = (shipmentId) => {
    setActiveShipmentId(shipmentId);
    setPage("shipment");
  };

  const openCommandCenter = (shipmentId = "", tab = "") => {
    setCommandContext({
      id: shipmentId,
      tab,
      nonce: Date.now(),
    });
    setPage("command");
  };

  const renderPage = () => {
    switch (page) {
      case "dashboard":
        return (
          <DashboardPage
            onOpenShipment={openShipment}
            onOpenCommandCenter={openCommandCenter}
          />
        );

      case "shipment":
        return (
          <ShipmentAuditPage
            shipmentId={activeShipmentId}
            onBack={() => setPage("dashboard")}
            onOpenCommandCenter={openCommandCenter}
          />
        );

      case "command":
        return (
          <CommandCenterPage
            shipmentId={commandContext.id}
            activeTab={commandContext.tab}
            nonce={commandContext.nonce}
            onBack={() => setPage("dashboard")}
          />
        );

      default:
        return (
          <DashboardPage
            onOpenShipment={openShipment}
            onOpenCommandCenter={openCommandCenter}
          />
        );
    }
  };

  return (
    <div className="app">
      <Sidebar
        activePage={page}
        setActivePage={setPage}
        onOpenShipment={openShipment}
        onOpenCommandCenter={openCommandCenter}
      />

      <main className="main">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;