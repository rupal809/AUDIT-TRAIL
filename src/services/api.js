export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

export const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === "true";

export class ApiError extends Error {
  constructor(message, status = 0, data = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export const apiRequest = async (endpoint, options = {}) => {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });
  } catch {
    throw new ApiError(
      `Cannot reach the Audit Trail API at ${API_BASE_URL}. Make sure the backend and MongoDB are running.`,
      0
    );
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    // Non-JSON response body
  }

  if (!response.ok) {
    throw new ApiError(
      data?.message || `Request failed with status ${response.status}`,
      response.status,
      data
    );
  }

  return data;
};
