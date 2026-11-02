const API_URL = "http://localhost:5000/api/reports";

async function request(url) {
  const response = await fetch(url);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch reports");
  }

  return result;
}

export const getEquipmentAnalytics = () => request(`${API_URL}/equipment`);
