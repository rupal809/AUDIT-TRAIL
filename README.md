# Audit Trail — Event-Sourced Inventory & Logistics Ledger

Instead of overwriting a shipment's state (CRUD), every change is stored as an
**immutable, versioned event**. The current state — or the state at any point in
the past — is reconstructed by **replaying (folding) the event log**.

Stack: React 19 + Vite + Recharts · Node.js / Express 5 · MongoDB (Mongoose 9)

## Run it

### Option A — Frontend demo only (no MongoDB needed)
```bash
npm install
npm run dev            # http://localhost:5173
```
`.env` has `VITE_USE_MOCK_DATA=true`, so the UI runs against an in-memory event
store with the same rules as the backend (append-only, versions, 409 conflicts).
Demo IDs: `MSKU1234567` (temperature-spike dispute), `TCLU7654321`, `HLBU9876543`, `CMAU1122334`.

### Option B — Full stack
```bash
# 1. MongoDB running on mongodb://127.0.0.1:27017
cd server && npm install && npm run dev      # API on http://localhost:5000
# 2. in the project root, set VITE_USE_MOCK_DATA=false in .env, then
npm install && npm run dev
```
Restart Vite after editing `.env`.

## Frontend features (per week plan)

| Week | Feature | Where |
|------|---------|-------|
| 1 | Dashboard + shipment search with validation, not-found and backend-down handling | `pages/DashboardPage.jsx`, `Components/SearchBar.jsx` |
| 2 | Vertical timeline of the raw, append-only event stream (version, time, payload) | `Components/EventTimeline.jsx` |
| Mid | Reconstruction check — state shown in the UI is compared with the backend replay | `Components/RewindSlider.jsx` |
| 3 | State scrubbing — slider, prev/next, and "view state as of date/time" | `Components/RewindSlider.jsx` |
| 4 | Recharts temperature chart over the event timeline (threshold, spikes, rewind marker) | `Components/TemperatureChart.jsx` |
| 4 | OCC — commands send `expectedVersion`; 409 conflicts shown with reload flow ("stale version" toggle for demo) | `pages/CommandCenterPage.jsx` |
| — | Cryptographic proof — SHA-256 hash chain from the server, recomputed in the browser and compared | `Components/IntegrityProof.jsx` |
| — | Export audit (events + state + hash chain) as JSON for disputes | `pages/ShipmentAuditPage.jsx` |

## API (all routes available at `/` and `/api`)

| Method | Route | Side |
|--------|-------|------|
| POST | `/shipment/create` · `/shipment/move` · `/shipment/temperature` | Command |
| POST | `/events` | Command |
| GET | `/events/:id` · `/events/:id/version` | Query |
| GET | `/events/:id/proof` — SHA-256 hash chain **(new)** | Query |
| GET | `/replay/:id/state` · `?version=N` for point-in-time **(new)** | Query |
| GET | `/dashboard/summary` **(new)** | Query |
| GET | `/shipment/:id` · `/shipment/history/:id` | Query |

## Integration changes made to the backend
- `app.js`: routes also mounted under `/api` (matches `VITE_API_BASE_URL`); loads `dotenv`.
- `config/db.js`: reads `MONGO_URI` from env.
- `models/Event.js`: immutability hooks now `throw` (Mongoose 9 removed `next()` in pre hooks); also blocks `replaceOne`, `findOneAndReplace` and `save()` on an existing event.
- `routes/shipment.js` + reducer: `/move` accepts every status the reducer supports (`LOADED_ON_TRUCK`, `IN_TRANSIT`, `DELIVERED` added).
- New: `routes/dashboard.js`, `services/dashboardSummary.js`, `utils/hashChain.js`.

## Notes
- `src/utils/shipmentReducer.js`, `hashChain.js` and `dashboardSummary.js` mirror the server versions — keep them in sync.
- The hash chain is tamper-*evident*: to prove history later, record the head hash (e.g. in the exported audit report).
- `client/` is an unused Vite starter template; the real frontend is in `src/`.
