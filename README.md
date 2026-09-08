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

### Frontend & API Integration
- Frontend UI development is complete and currently uses demo data.
- Query API integration is in progress.
- Available Query API functionality is being connected with the frontend.
- API responses are being verified against the data displayed in the UI.
- Integration testing is being performed to identify issues between the frontend and backend.

### Query API
- Query API development is partially complete.
- Initial query functionality has been implemented.
- Further API endpoints and query operations are still under development.
- Integration with the frontend is pending for the completed endpoints.
- API testing and validation will be performed as additional functionality is completed.

### Backend Development & Integration
- Backend development is currently in progress.
- Remaining backend functionality is being completed by the respective team members.
- Completed backend modules are being reviewed and prepared for integration.
- Backend branches will be merged after testing and verification.
- Frontend integration with the completed backend APIs will continue after the merging process.

### Next Steps
- Complete the remaining backend functionality.
- Review and test the completed backend modules.
- Merge the finalized backend changes.
- Connect the frontend with the live backend API URLs.
- Perform end-to-end integration testing.

# Audit Trail Testing Plan

## Objective

The objective of testing is to verify that the Audit Trail application works correctly across the frontend, backend APIs, shipment search, shipment history, and event-based operations.

## Testing Areas

- Frontend UI testing
- Shipment search testing
- Query API testing
- Command API testing
- Shipment history testing
- Event Store testing
- API integration testing
- Error handling and validation
- End-to-end testing

## Testing Approach

Testing will be performed using valid inputs, invalid inputs, edge cases, and integration scenarios. Issues identified during testing will be documented and reported to the respective team member for resolution.

## Test Status

Testing will be updated as backend functionality and API integration are completed.

# Audit Trail Architecture

## Overview

Audit Trail is an event-sourced inventory and logistics system designed to maintain an immutable history of shipment and container operations.

The system is divided into frontend, backend, API, and event storage components.

## Main Components

### Frontend

The frontend provides the web interface for users to:

- View the dashboard
- Search shipments
- View shipment details
- View shipment event history
- Rewind shipment state using available events

The frontend is implemented using React.

Currently, the frontend uses demo/mock data for available UI functionality.

### Backend

The backend provides APIs for processing shipment operations and retrieving shipment information.

Backend functionality includes:

- Command operations
- Query operations
- Shipment history
- Event processing

Backend modules are currently under development and integration.

### Event Store / Database

The Event Store is responsible for maintaining shipment and container events.

Instead of replacing previous state information, state-changing operations are stored as individual events.

These events can later be used to reconstruct the shipment state and history.

## Application Flow

```text
User
  ↓
React Frontend
  ↓
Backend API
  ↓
Command / Query Processing
  ↓
Event Store / Database
  ↓
API Response
  ↓
React Frontend
```

## Testing Documentation

### Phase 1 Testing

Phase 1 frontend testing has been completed and the testing documentation has been prepared.

The Phase 1 testing documentation covers:

- Frontend UI testing
- Dashboard functionality
- Shipment search
- Shipment details
- Shipment State Rewind
- Mock/demo data validation
- UI alignment and usability checks
- Frontend functional test cases

The detailed Phase 1 testing report is ready and will be added to the repository separately.

### Next Steps

- Upload the Phase 1 testing report.
- Execute and record the defined test cases.
- Document any issues identified during testing.
- Continue testing as backend integration becomes available.
- Perform frontend-backend integration testing.
