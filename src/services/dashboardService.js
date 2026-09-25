import { apiRequest, USE_MOCK_DATA } from "./api";
import { mockGetAllEvents } from "./mockStore";
import { buildDashboardSummary } from "../utils/dashboardSummary";

// GET /dashboard/summary — totals, status breakdown, alerts, recent events, activity
export const getDashboardSummary = async () => {
  if (USE_MOCK_DATA) {
    return buildDashboardSummary(await mockGetAllEvents());
  }

  return apiRequest("/dashboard/summary");
};
