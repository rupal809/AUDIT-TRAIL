import { useState } from "react";
import "./App.css";

import Sidebar from "./Components/Sidebar";
import DashboardPage from "./pages/DashboardPage";
import ShipmentAuditPage from "./pages/ShipmentAuditPage";
import CommandCenterPage from "./pages/CommandCenterPage";

function App() {
  const [page, setPage] = useState("dashboard");
  const [activeShipmentId, setActiveShipmentId] = useState("");
  const [commandContext, setCommandContext] = useState({ id: "", tab: "", nonce: 0 });

  const openShipment = (shipmentId) => {
    setActiveShipmentId(shipmentId);
    setPage("audit");
  };

  const openCommands = (shipmentId = "", tab = "") => {
    setCommandContext((ctx) => ({ id: shipmentId, tab, nonce: ctx.nonce + 1 }));
    setPage("commands");
  };

  const navigate = (target) => {
    if (target === "commands") {
      openCommands(activeShipmentId);
      return;
    }
    setPage(target);
  };

  return (
    <div className="app">
      <Sidebar page={page} onNavigate={navigate} />

      <main className="main">
        {page === "dashboard" && (
          <DashboardPage onOpenShipment={openShipment} onNavigate={navigate} />
        )}

        {page === "audit" && (
          <ShipmentAuditPage
            key={activeShipmentId}
            shipmentId={activeShipmentId}
            onOpenShipment={openShipment}
            onRecordEvent={openCommands}
          />
        )}

        {page === "commands" && (
          <CommandCenterPage
            key={commandContext.nonce}
            initialShipmentId={commandContext.id}
            initialTab={commandContext.tab}
            onOpenShipment={openShipment}
          />
        )}
      </main>
    </div>
  );
}

export default App;
