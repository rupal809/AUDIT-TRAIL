import { apiRequest } from "./api";

// to fetch dashboard stats 
export const getDashboardStats = async () => {
  return apiRequest("/dashboard/stats");
};

// to fetch recent events 
export const getRecentEvents = async () => {
  return apiRequest("/dashboard/events");
};

// to fetch delayed containers 
export const getDelayedContainers = async () => {
  return apiRequest("/dashboard/delayed-containers");
};