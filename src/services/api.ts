import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";

// IMPORTANT:
// 1) Dacă ai VITE_API_URL setat, îl folosim.
// 2) Altfel, dacă ești pe localhost -> backend pe localhost.
// 3) Altfel, folosim același hostname ca pagina (adică IP-ul laptopului din LAN).
const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && typeof envUrl === "string" && envUrl.trim().length > 0) {
    return envUrl.replace(/\/+$/, "");
  }

  const { protocol, hostname } = window.location;

  const isLocal =
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "0.0.0.0";

  // NOTE: backend-ul tău e pe 3001
  // dacă frontend e pe IP-ul laptopului (ex 192.168.x.x), asta va chema backend-ul tot pe acel IP.
  const base = isLocal
    ? `${protocol}//localhost:3001/api`
    : `${protocol}//${hostname}:3001/api`;

  return base;
};

const api: AxiosInstance = axios.create({
  baseURL: getBaseUrl(),
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & {
          _retry?: boolean;
        })
      | null;

    if (!originalRequest) return Promise.reject(error);

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("Missing refresh token");

        // folosim același baseURL ca api
        const refreshRes = await axios.post(
          `${getBaseUrl()}/auth/refresh`,
          { refreshToken },
          { headers: { "Content-Type": "application/json" } }
        );

        const { token, refreshToken: newRefreshToken } = (refreshRes.data
          ?.data ?? refreshRes.data) as any;

        if (!token) throw new Error("Refresh did not return token");

        localStorage.setItem("accessToken", token);
        if (newRefreshToken)
          localStorage.setItem("refreshToken", newRefreshToken);

        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${token}`;

        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
