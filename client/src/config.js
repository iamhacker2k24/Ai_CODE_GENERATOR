// Centralized backend server URL configuration from environment variables
export const serverUrl = (
  import.meta.env.VITE_BACKEND_API_KEY ||
  import.meta.env.VITE_BACKEND_URL ||
  "http://localhost:3000"
).replace(/\/+$/, "");

export default serverUrl;
