import { useState } from "react";
import "./App.css";

import Sidebar from "./Components/Sidebar";

import DashboardPage from "./pages/DashboardPage";
import ShipmentAuditPage from "./pages/ShipmentAuditPage";
import CommandCenterPage from "./pages/CommandCenterPage";

function App() {
  const [page, setPage] = useState("Dashboard");

  const [activeShipmentId, setActiveShipmentId] = useState("");

  const [commandContext, setCommandContext] = useState({
    id: "",
    tab: "",
    nonce: 0,
  });

  const openShipment = (shipmentId) => {
    setActiveShipmentId(shipmentId);
    setPage("Shipments");
  };

  const openCommandCenter = (shipmentId = "", tab = "") => {
    setCommandContext({
      id: shipmentId,
      tab: tab,
      nonce: Date.now(),
    });

    setPage("Command Center");
  };

  const handlePageChange = (selectedPage) => {
    setPage(selectedPage);
  };

  const renderPage = () => {
    switch (page) {
      case "Dashboard":
        return (
          <DashboardPage
            onOpenShipment={openShipment}
            onOpenCommandCenter={openCommandCenter}
          />
        );

      case "Shipments":
        return (
          <ShipmentAuditPage
            shipmentId={activeShipmentId}
            onBack={() => setPage("Dashboard")}
            onOpenCommandCenter={openCommandCenter}
          />
        );

      case "Containers":
        return (
          <CommandCenterPage
            shipmentId={activeShipmentId}
            activeTab="containers"
            nonce={commandContext.nonce}
            onBack={() => setPage("Dashboard")}
          />
        );

      case "Analytics":
        return (
          <CommandCenterPage
            shipmentId={activeShipmentId}
            activeTab="analytics"
            nonce={commandContext.nonce}
            onBack={() => setPage("Dashboard")}
          />
        );

      case "Alerts":
        return (
          <CommandCenterPage
            shipmentId={activeShipmentId}
            activeTab="alerts"
            nonce={commandContext.nonce}
            onBack={() => setPage("Dashboard")}
          />
        );

      case "Settings":
        return (
          <CommandCenterPage
            shipmentId={activeShipmentId}
            activeTab="settings"
            nonce={commandContext.nonce}
            onBack={() => setPage("Dashboard")}
          />
        );

      case "Command Center":
        return (
          <CommandCenterPage
            shipmentId={commandContext.id}
            activeTab={commandContext.tab}
            nonce={commandContext.nonce}
            onBack={() => setPage("Dashboard")}
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
        setActivePage={handlePageChange}
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