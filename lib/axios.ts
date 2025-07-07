import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use((config) => {
  const accessToken =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Add debugging for development
if (process.env.NODE_ENV === 'development') {
  api.interceptors.request.use((config) => {
    console.log("🚀 API Request:", config.method?.toUpperCase(), config.baseURL + config.url);
    return config;
  });

  api.interceptors.response.use(
    (response) => {
      console.log("✅ API Response:", response.status, response.config.url);
      return response;
    },
    (error) => {
      console.error("❌ API Error:", error.response?.status, error.response?.data || error.message);
      console.error("Full error:", error);
      return Promise.reject(error);
    }
  );
}

export default api;
