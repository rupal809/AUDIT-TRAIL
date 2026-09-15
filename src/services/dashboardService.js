import { apiRequest } from "./api";

// to fetch dashboard stats from the backend
export const getDashboardStats = async () => {
  return apiRequest("/dashboard/stats");
};

// to fetch recent events from the backend
export const getRecentEvents = async () => {
  return apiRequest("/dashboard/events");
};

// to fetch delayed containers from the backend
export const getDelayedContainers = async () => {
  return apiRequest("/dashboard/delayed-containers");
};