// src/features/organizer/services/auth.ts
export function getAuthToken(): string | null {
  // 1) cele mai comune chei
  const direct =
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("access_token");

  if (direct && direct.trim().length > 0) return direct;

  // 2) fallback: token în user (dacă la login salvezi { token: "..."} în "user")
  const userRaw = localStorage.getItem("user");
  if (userRaw) {
    try {
      const u = JSON.parse(userRaw);
      const t =
        u?.token ||
        u?.accessToken ||
        u?.access_token ||
        u?.jwt ||
        u?.data?.token;

      if (typeof t === "string" && t.trim().length > 0) return t;
    } catch {
      // ignore
    }
  }

  return null;
}

export function authHeaders(): HeadersInit {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export function forceLogoutAndRedirect() {
  // nu atinge alte chei decât ce folosești tu
  localStorage.removeItem("token");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("access_token");
  // păstrezi user dacă vrei, dar eu îl scot ca să fie curat
  localStorage.removeItem("user");

  window.location.href = "/login";
}
