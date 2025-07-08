import axios from "axios";
import { refreshToken } from "@/services/auth/refresh";
import { removeToken } from "@/lib/auth";

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

// Add response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and we haven't already tried to refresh
    // Don't try to refresh if the failing request was already a refresh request
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/auth/refresh')) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const newToken = await refreshToken();
        
        // Update the original request with new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        
        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        removeToken();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

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
