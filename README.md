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


# Audit Trail Test Cases

## Frontend UI

1. Verify that the dashboard loads successfully.
2. Verify that all dashboard components are displayed correctly.
3. Verify that the UI remains functional after refreshing the page.
4. Verify that navigation between available UI sections works correctly.

## Shipment Search

5. Search for a valid shipment ID.
6. Search for an invalid shipment ID.
7. Perform a search with an empty input.
8. Search using an invalid input format.
9. Verify that the correct shipment information is displayed.
10. Verify that appropriate feedback is displayed when no shipment is found.

## Query API

11. Retrieve shipment information using a valid request.
12. Retrieve shipment information using an invalid shipment ID.
13. Retrieve shipment history for a valid shipment.
14. Verify that shipment history is returned in the correct order.
15. Verify API response for missing or invalid parameters.
16. Verify API error handling for invalid requests.

## Command API

17. Create a shipment using valid data.
18. Create a shipment using invalid data.
19. Perform a supported shipment update operation.
20. Perform an operation with invalid input.
21. Verify that the appropriate event is generated after a command operation.

## Event Store / MongoDB

22. Verify that newly generated events are stored correctly.
23. Verify that existing events remain available after new events are added.
24. Verify that events contain the required information.
25. Verify that events can be retrieved correctly.
26. Verify that shipment state/history can be reconstructed from stored events.

## Frontend and Backend Integration

27. Verify that the frontend sends requests to the correct API endpoints.
28. Verify that API responses are displayed correctly in the UI.
29. Verify frontend behavior when the API returns an error.
30. Verify frontend behavior when the backend is unavailable.

## End-to-End

31. Create a shipment and verify it through the UI.
32. Perform a shipment operation and verify the corresponding event.
33. Search for a shipment and verify its current information.
34. Retrieve shipment history and verify the complete event timeline.
35. Verify the complete flow from frontend request to backend response and UI display.
