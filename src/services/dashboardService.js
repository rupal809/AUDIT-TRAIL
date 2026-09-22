import { apiRequest } from "./api";

export const getDashboardStats = async () => {
  return apiRequest("/dashboard/stats");
};

export const getRecentEvents = async () => {
  return apiRequest("/dashboard/events");
};

export const getDelayedContainers = async () => {
  return apiRequest("/dashboard/delayed-containers");
};