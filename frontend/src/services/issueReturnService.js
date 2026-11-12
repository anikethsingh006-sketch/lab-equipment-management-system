const API_URL = `${import.meta.env.VITE_API_URL}/api`;

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
    throw new Error(result.message || "Something went wrong");
  }

  return result;
}

export const getActiveIssues = () => request(`${API_URL}/issue-return/active`);

export const issueEquipment = (data) =>
  request(`${API_URL}/issue-return/issue`, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const returnEquipment = (issueId) =>
  request(`${API_URL}/issue-return/${issueId}/return`, {
    method: "PATCH",
  });
