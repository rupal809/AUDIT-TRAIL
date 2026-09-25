import { useEffect, useState } from "react";

import Header from "../Components/Header";
import SearchBar from "../Components/SearchBar";
import ShipmentDetails from "../Components/ShipmentDetails";
import EventTimeline from "../Components/EventTimeline";
import RewindSlider from "../Components/RewindSlider";
import TemperatureChart from "../Components/TemperatureChart";
import IntegrityProof from "../Components/IntegrityProof";

import { getShipmentAudit } from "../services/shipmentService";
import { USE_MOCK_DATA } from "../services/api";
import { demoShipmentIds } from "../Data/shipmentData";
import { buildHashChain } from "../utils/hashChain";
import { downloadJson, validateShipmentId } from "../utils/format";

/*
 * Forensic view for one shipment. Remounted (key) whenever the active ID changes.
 */
function ShipmentAuditPage({ shipmentId, onOpenShipment, onRecordEvent }) {
  const [query, setQuery] = useState(shipmentId || "");
  const [inputError, setInputError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [result, setResult] = useState({ key: null });
  const [selectedVersion, setSelectedVersion] = useState(null);

  const requestKey = shipmentId ? `${shipmentId}#${reloadKey}` : null;

  useEffect(() => {
    if (!shipmentId) return undefined;
    let cancelled = false;
    const key = `${shipmentId}#${reloadKey}`;

    getShipmentAudit(shipmentId)
      .then((audit) => {
        if (cancelled) return;
        setResult({ key, audit });
        setSelectedVersion(audit.state.version);
      })
      .catch((error) => !cancelled && setResult({ key, error: error.message }));

    return () => {
      cancelled = true;
    };
  }, [shipmentId, reloadKey]);

  const loading = Boolean(requestKey) && result.key !== requestKey;
  const { audit, error } = result.key === requestKey ? result : {};

  const handleSearch = (value) => {
    const id = value.trim();
    const validation = validateShipmentId(id);
    setInputError(validation);
    if (validation) return;

    if (id === shipmentId) {
      setReloadKey((k) => k + 1);
    } else {
      onOpenShipment(id);
    }
  };

  const handleExport = async () => {
    const proof = await buildHashChain(audit.events);
    downloadJson(`audit-${shipmentId}-v${audit.state.version}.json`, {
      shipmentId,
      exportedAt: new Date().toISOString(),
      currentState: audit.state,
      events: audit.events,
      integrity: { algorithm: proof.algorithm, headHash: proof.headHash, chain: proof.chain },
    });
  };

  const version = selectedVersion ?? audit?.state.version;

  return (
    <>
      <Header
        title="Shipment Audit Trail"
        subtitle="Search a container to replay its history, rewind its state and verify the event sequence."
      >
        {audit && (
          <>
            <button type="button" className="btn ghost" onClick={() => setReloadKey((k) => k + 1)}>↻ Reload</button>
            <button type="button" className="btn ghost" onClick={handleExport}>⬇ Export Audit</button>
            <button type="button" className="btn primary" onClick={() => onRecordEvent(shipmentId)}>+ Record Event</button>
          </>
        )}
      </Header>

      <SearchBar
        shipmentId={query}
        setShipmentId={setQuery}
        onSearch={handleSearch}
        loading={loading}
        suggestions={USE_MOCK_DATA ? demoShipmentIds : []}
      />

      {inputError && <div className="alert error">{inputError}</div>}

      {!shipmentId && !inputError && (
        <div className="empty-state">
          Enter a shipment or container ID to view its immutable event history.
        </div>
      )}

      {loading && <div className="empty-state">Replaying events for {shipmentId}…</div>}

      {error && !loading && (
        <div className="alert error">
          {error}
          {error.includes("not found") && (
            <button type="button" className="btn ghost" onClick={() => onRecordEvent(shipmentId, "create")}>
              Create “{shipmentId}”
            </button>
          )}
        </div>
      )}

      {audit && !loading && (
        <>
          <ShipmentDetails shipment={audit.state} eventCount={audit.events.length} />

          <div className="audit-grid">
            <EventTimeline
              events={audit.events}
              selectedVersion={version}
              onSelect={setSelectedVersion}
            />
            <RewindSlider
              shipmentId={shipmentId}
              events={audit.events}
              version={version}
              onChange={setSelectedVersion}
            />
          </div>

          <TemperatureChart events={audit.events} selectedVersion={version} />

          <IntegrityProof shipmentId={shipmentId} events={audit.events} />
        </>
      )}
    </>
  );
}

export default ShipmentAuditPage;
