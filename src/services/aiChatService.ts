// Use same base URL logic as other services
const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && typeof envUrl === "string" && envUrl.trim().length > 0) {
    return envUrl.replace(/\/+$/, "");
  }
  const { protocol, hostname } = window.location;
  const isLocal = hostname === "localhost" || hostname === "127.0.0.1" || hostname === "0.0.0.0";
  return isLocal ? `${protocol}//localhost:3001/api` : `${protocol}//${hostname}:3001/api`;
};

const API_URL = getBaseUrl();

// Use same token retrieval as other services - check all possible storage keys
const getToken = (): string | null => {
  return (
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token") ||
    sessionStorage.getItem("accessToken") ||
    sessionStorage.getItem("token")
  );
};

export interface ChatResponse {
  response: string;
}

export interface StudentContext {
  profile: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    facultyId: number | null;
    facultyName: string | null;
  };
  enrolledEvents: Array<{
    id: number;
    name: string;
    date: string;
    time: string;
    location: string;
    category: string;
  }>;
  favoriteEvents: Array<{
    id: number;
    name: string;
    date: string;
    time: string;
    location: string;
    category: string;
  }>;
  upcomingEvents: Array<{
    id: number;
    name: string;
    date: string;
    time: string;
    location: string;
    category: string;
    currentParticipants: number;
    maxParticipants: number;
  }>;
  preferredCategories: string[];
}

export const aiChatService = {
  /**
   * Send a chat message to the backend AI endpoint
   * The backend handles all context loading and response generation
   * Never throws - returns fallback response on error
   */
  async sendMessage(message: string): Promise<ChatResponse> {
    const token = getToken();
    console.log('[AI Chat] Sending message, token exists:', !!token);
    
    if (!token) {
      return { response: "Te rog să te autentifici pentru a folosi asistentul." };
    }

    try {
      console.log('[AI Chat] Making request to:', `${API_URL}/ai/chat`);
      const response = await fetch(`${API_URL}/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message }),
      });

      console.log('[AI Chat] Response status:', response.status);

      // Try to parse response even on error - backend may return helpful message
      let data: any = null;
      try {
        const text = await response.text();
        console.log('[AI Chat] Response text length:', text?.length);
        if (text) {
          data = JSON.parse(text);
        }
      } catch (parseError) {
        console.error('[AI Chat] Failed to parse response:', parseError);
      }
      
      // If we have a response field, use it (success or backend-handled error)
      if (data?.response) {
        console.log('[AI Chat] Got response from backend');
        return { response: data.response };
      }

      // Handle specific HTTP errors with backend message if available
      if (response.status === 401) {
        return { response: data?.message || "Sesiunea a expirat. Te rog să te autentifici din nou." };
      }
      if (response.status === 403) {
        return { response: data?.message || "Nu ai permisiunea necesară pentru această acțiune." };
      }
      if (response.status === 400) {
        return { response: data?.message || "Cererea nu este validă. Te rog să reformulezi întrebarea." };
      }
      if (response.status >= 500) {
        return { response: "Serverul întâmpină probleme. Te rog să încerci din nou în câteva momente." };
      }

      // Fallback with any message from backend
      console.error('[AI Chat] Unexpected response:', response.status, data);
      return { response: data?.message || "Nu am putut procesa cererea. Te rog să încerci din nou." };
    } catch (error) {
      console.error('[AI Chat] Network/fetch error:', error);
      return { response: "Conexiunea la server a eșuat. Verifică dacă serverul rulează și încearcă din nou." };
    }
  },

  /**
   * Get the student's context for the chatbot
   * This includes profile, enrollments, favorites, and upcoming events
   * Never throws - returns empty context on error
   */
  async getStudentContext(): Promise<StudentContext> {
    const token = getToken();
    const emptyContext: StudentContext = {
      profile: { id: 0, firstName: "", lastName: "", email: "", facultyId: null, facultyName: null },
      enrolledEvents: [],
      favoriteEvents: [],
      upcomingEvents: [],
      preferredCategories: [],
    };

    if (!token) {
      return emptyContext;
    }

    try {
      const response = await fetch(`${API_URL}/ai/students/me/context`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error("Failed to get student context:", response.status);
        return emptyContext;
      }

      const data = await response.json();
      return data || emptyContext;
    } catch (error) {
      console.error("AI Context Service Error:", error);
      return emptyContext;
    }
  },
};
