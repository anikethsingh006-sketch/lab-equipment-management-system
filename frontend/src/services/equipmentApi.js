const API_URL = "http://localhost:5000/api/equipment";

// Fetch all equipment
export async function getEquipment() {
  const response = await fetch(API_URL);

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch equipment");
  }

  return result.data;
}

// Create equipment
export async function createEquipment(equipment) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(equipment),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to create equipment");
  }

  return result.data;
}

// Update equipment
export async function updateEquipment(id, updates) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update equipment");
  }

  return result.data;
}

// Delete equipment
export async function deleteEquipment(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to delete equipment");
  }

  return result;
}
