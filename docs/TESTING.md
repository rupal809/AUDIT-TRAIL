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

# Day 1(03/09/2026) - Frontend Dashboard Testing Testcases 

## Objective

Test the currently available Audit Trail frontend using mock data, with focus on the dashboard, UI layout, shipment search, and shipment details.

## Dashboard Testing

1. Verify that the Audit Trail dashboard loads successfully.

2. Verify that the Dashboard section is highlighted as the active navigation item.

3. Verify that the sidebar navigation is properly aligned with the main dashboard content.

4. Verify that the shipment search input field is displayed correctly.

5. Verify that the Search button is displayed correctly and is properly aligned with the search field.

6. Verify that the dashboard summary cards are displayed correctly.

7. Verify that the Container Status chart is displayed correctly.

8. Verify that the Shipment Overview chart is displayed correctly.

9. Verify that the Top Delayed Containers section is displayed correctly.

10. Verify that the Recent Events section is displayed correctly.

11. Verify that all dashboard cards have proper spacing and alignment.

12. Verify that charts remain within their respective containers without overflow.

13. Verify that dashboard text, labels, values, and headings are clearly visible.

14. Verify that the overall dashboard layout remains visually consistent.

## Shipment Search Testing

15. Verify that a valid demo shipment ID can be entered in the search field.

16. Verify that clicking the Search button performs the shipment search.

17. Verify that the supported demo shipment ID displays the corresponding mock shipment information.

18. Verify that the Shipment Details section is displayed after a successful search.

19. Verify that the Shipment ID is displayed correctly in the Shipment Details section.

20. Verify that the Current Status is displayed correctly.

21. Verify that the Current Location is displayed correctly.

22. Verify that the Version value is displayed correctly.

23. Verify that the Last Event information is displayed correctly.

24. Verify that the Last Updated information is displayed correctly.

25. Verify that an invalid shipment ID displays the "Shipment not found" message.

26. Verify that the "Shipment not found" message is displayed clearly without breaking the page layout.

27. Verify that an empty shipment search is handled without breaking the UI.

28. Verify that the search interface remains functional after performing multiple searches.

29. Verify that the Shipment Details section is properly aligned with the dashboard layout.

30. Verify that the shipment information remains readable and properly spaced after search results are displayed.

## Day 1 Scope

Testing is limited to the currently available frontend functionality and mock shipment data.

Backend-dependent modules and live API functionality are not included in Day 1 testing.

# Day (04/09/2026) - Frontend Testing Testcases

## Objective

Continue frontend testing using the available mock shipment data, focusing on Shipment State Rewind, event information, UI alignment, usability, and the complete available frontend flow.

## Shipment State Rewind Testing

1. Verify that the Shipment State Rewind section is displayed for the demo shipment.

2. Verify that the shipment event timeline is displayed correctly.

3. Verify that the available shipment events are displayed in the timeline.

4. Verify that the currently selected event is visually highlighted.

5. Verify that the rewind control can be interacted with.

6. Verify that changing the rewind position updates the selected shipment event.

7. Verify that the selected event name is displayed correctly.

8. Verify that the selected event time is displayed correctly.

9. Verify that the selected event location is displayed correctly.

10. Verify that the selected event description is displayed correctly.

11. Verify that the shipment state information changes according to the selected event.

12. Verify that the Shipment State Rewind section remains properly aligned after changing the selected event.

13. Verify that event information does not overlap with other UI components.

## Mock Data Testing

14. Verify that the Container Status section displays the available mock data correctly.

15. Verify that the Shipment Overview section displays the available mock data correctly.

16. Verify that the Top Delayed Containers section displays the available mock records correctly.

17. Verify that the Recent Events section displays the available mock event records correctly.

18. Verify that mock data is displayed consistently across the dashboard and shipment details sections.

## Web UI Alignment Testing

19. Verify that the sidebar remains properly aligned with the main content area.

20. Verify that dashboard cards maintain consistent spacing.

21. Verify that shipment search components remain properly aligned.

22. Verify that Shipment Details cards maintain consistent alignment.

23. Verify that the Shipment State Rewind section remains within its designated container.

24. Verify that charts do not overlap with other dashboard components.

25. Verify that long shipment or event information does not break the UI layout.

26. Verify that error messages do not cause UI elements to shift unexpectedly.

27. Verify that buttons and interactive elements remain properly positioned.

28. Verify that headings, labels, values, and event information remain readable.

29. Verify that the page remains visually consistent after refreshing the browser.

30. Verify that no visible UI component is clipped, overlapped, or incorrectly positioned.

## Complete Available Frontend Flow

31. Verify the complete available flow:

    Dashboard
    → Enter Demo Shipment ID
    → Search Shipment
    → View Shipment Details
    → View Shipment State Rewind
    → Change Rewind Position
    → Verify Updated Shipment State

32. Verify that the complete available frontend flow can be performed without UI errors.

33. Verify that an invalid shipment search can be performed after a successful search.

34. Verify that the "Shipment not found" result does not break the dashboard layout.

35. Verify that the frontend remains usable after switching between valid and invalid shipment searches.

## Day 2 Scope

Testing is limited to the currently implemented frontend and available mock shipment data.

Modules that are not yet connected to the backend are excluded from functional backend testing.
