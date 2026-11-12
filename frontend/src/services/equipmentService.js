const API_URL = `${import.meta.env.VITE_API_URL}/api/equipment`;

export const getEquipment = async () => {
  const response = await fetch(API_URL);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch equipment");
  }

  return result;
};
