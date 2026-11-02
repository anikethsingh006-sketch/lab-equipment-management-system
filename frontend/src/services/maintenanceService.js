const API_URL = "http://localhost:5000/api/maintenance";

async function request(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Request failed");
  }

  return result;
}

// Get all maintenance reports
export const getAllMaintenance = () => request(API_URL);

// Create a maintenance report
export const createMaintenance = (data) =>
  request(API_URL, {
    method: "POST",
    body: JSON.stringify(data),
  });

// Update maintenance status
export const updateMaintenance = (id, status) =>
  request(`${API_URL}/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
