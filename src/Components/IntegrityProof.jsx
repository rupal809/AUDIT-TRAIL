import { useEffect, useState } from "react";
import { buildHashChain, shortHash } from "../utils/hashChain";
import { getIntegrityProof } from "../services/shipmentService";
import { humanize } from "../utils/format";

/*
 * Cryptographic proof of the event sequence.
 * The backend returns a SHA-256 hash chain; the browser recomputes it
 * independently from the raw events and compares every link.
 */
function IntegrityProof({ shipmentId, events }) {
  const [result, setResult] = useState({ events: null });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;

    Promise.all([getIntegrityProof(shipmentId), buildHashChain(events)])
      .then(([server, client]) => {
        if (cancelled) return;
        const firstMismatch = client.chain.find(
          (link, i) => server.chain?.[i]?.hash !== link.hash
        );
        setResult({
          events,
          server,
          client,
          verified:
            server.headHash === client.headHash &&
            server.chain?.length === client.chain.length &&
            !firstMismatch,
          firstMismatch,
          error: "",
        });
      })
      .catch((error) => {
        if (!cancelled) setResult({ events, error: error.message });
      });

    return () => {
      cancelled = true;
    };
  }, [shipmentId, events]);

  const loading = result.events !== events;

  const copyHead = async () => {
    try {
      await navigator.clipboard.writeText(result.client.headHash);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="card">
      <div className="card-header">
        <div>
          <h3>Integrity Proof</h3>
          <small className="muted">
            SHA-256 hash chain · each hash covers the previous hash + event data
          </small>
        </div>
        {!loading && !result.error && (
          <span className={`proof-badge ${result.verified ? "good" : "bad"}`}>
            {result.verified ? "✓ Sequence verified" : "✗ Chain mismatch"}
          </span>
        )}
      </div>

      {loading && <div className="empty-state small">Computing hash chain…</div>}

      {!loading && result.error && (
        <div className="alert error">Could not load proof: {result.error}</div>
      )}

      {!loading && !result.error && (
        <>
          <div className="head-hash">
            <div>
              <span>Head hash (fingerprint of the entire history)</span>
              <code>{result.client.headHash}</code>
            </div>
            <button type="button" className="btn ghost" onClick={copyHead}>
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          {!result.verified && result.firstMismatch && (
            <div className="alert error">
              Browser and server disagree from version v{result.firstMismatch.version}.
              The stored history may have been altered.
            </div>
          )}

          <div className="table-scroll">
            <table className="proof-table">
              <thead>
                <tr>
                  <th>Ver.</th>
                  <th>Event</th>
                  <th>Previous hash</th>
                  <th>Hash</th>
                  <th>Match</th>
                </tr>
              </thead>
              <tbody>
                {result.client.chain.map((link, i) => {
                  const ok = result.server.chain?.[i]?.hash === link.hash;
                  return (
                    <tr key={link.version}>
                      <td>v{link.version}</td>
                      <td>{humanize(link.eventType)}</td>
                      <td className="mono" title={link.prevHash}>{shortHash(link.prevHash)}</td>
                      <td className="mono" title={link.hash}>{shortHash(link.hash)}</td>
                      <td className={ok ? "text-success" : "text-danger"}>{ok ? "✓" : "✗"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className="footnote">
            Changing, removing or re-ordering any past event changes every later hash.
            Record the head hash (e.g. in a dispute report) to prove later that the history was not modified.
          </p>
        </>
      )}
    </section>
  );
}

export default IntegrityProof;
