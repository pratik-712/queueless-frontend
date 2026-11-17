// All backend requests go through this file.
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options
  });

  const text = await response.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }

  if (!response.ok) {
    const message = data?.message || data?.error || (typeof data === "string" ? data : `Request failed (${response.status})`);
    throw new Error(message);
  }
  return data;
}

export const api = {
  getQueues: () => request("/queues"),
  getOrganizations: () => request("/organizations"),
  getQueuesForOrganization: (id) => request(`/queues/organization/${id}`),
  createToken: (queueId, customerName) => request(`/tokens/join/${queueId}?customerName=${encodeURIComponent(customerName)}`, { method: "POST" }),
  getTokens: () => request("/tokens"),
  getQueueTokens: (queueId) => request(`/tokens/queue/${queueId}`),
  getPosition: (tokenId) => request(`/tokens/${tokenId}/position`),
  updateTokenStatus: (tokenId, status) => request(`/tokens/${tokenId}/status`, { method: "PUT", body: JSON.stringify(status) }),
  callNext: (queueId) => request(`/tokens/queue/${queueId}/call-next`, { method: "PUT" }),
  getSummary: (queueId) => request(`/tokens/queue/${queueId}/summary`)
};