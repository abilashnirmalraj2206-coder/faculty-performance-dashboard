export const API_URL =
  "https://faculty-performance-dashboard.onrender.com/api";

export const authHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    ...(token && {
      Authorization: `Bearer ${token}`,
    }),
  };
};

export const apiFetch = async (endpoint, options = {}) => {
  const cleanEndpoint = endpoint.startsWith("/api")
    ? endpoint.replace("/api", "")
    : endpoint;

  const response = await fetch(`${API_URL}${cleanEndpoint}`, {
    ...options,
    headers: {
      ...authHeaders(),
      ...(options.headers || {}),
    },
  });

  return response;
};