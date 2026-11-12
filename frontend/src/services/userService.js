const API_URL = `${import.meta.env.VITE_API_URL}/api/users`;

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

export const getAllUsers = () => request(API_URL);

export const createUser = (data) =>
  request(API_URL, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateUser = (id, data) =>
  request(`${API_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const updateUserStatus = (id, isActive) =>
  request(`${API_URL}/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ isActive }),
  });
