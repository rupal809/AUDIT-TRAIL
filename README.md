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


