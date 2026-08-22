# Audit Trail

## Project Overview

Audit Trail is an event-sourced inventory and logistics system designed to maintain an immutable chronological history of shipment and container events.

Instead of overwriting the previous state, the system stores each state-changing operation as an event and reconstructs the current state by replaying the event history.

## Key Concepts

- Event Sourcing
- CQRS (Command Query Responsibility Segregation)
- MongoDB Event Store
- Shipment History
- Immutable Event Timeline
- React-based Dashboard

## Project Development Status

### Frontend
- React frontend UI is ready.
- Dashboard and shipment search interfaces are implemented.
- Currently using demo/mock data for UI visualization.
- Backend API integration is pending.
- The frontend needs to be connected to the backend through the respective API URLs once the backend APIs are available and finalized.

### Next Step
- Replace demo data with live API responses.
- Configure the required backend API URLs.
- Connect frontend components to the corresponding backend endpoints.
- Perform end-to-end integration testing.
