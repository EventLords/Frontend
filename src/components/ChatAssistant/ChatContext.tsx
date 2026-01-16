/**
 * ChatContext - Provides data to the ChatAssistant component
 * Uses only frontend data - no backend calls for chat
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { StudentEvent } from "../../types/student";
import { studentEventsService } from "../../features/students/services/eventsService";
import { enrollmentService } from "../../features/students/services/enrollmentService";
import { mapApiEventToStudentEvent } from "../../features/students/services/event.mapper";
import { profileService } from "../../services/profileService";

export interface ChatData {
  events: StudentEvent[];
  favorites: StudentEvent[];
  registrations: StudentEvent[];
  studentName: string;
  isLoading: boolean;
}

interface ChatContextValue extends ChatData {
  refreshData: () => Promise<void>;
}

const defaultChatData: ChatContextValue = {
  events: [],
  favorites: [],
  registrations: [],
  studentName: "Student",
  isLoading: true,
  refreshData: async () => {},
};

const ChatContext = createContext<ChatContextValue>(defaultChatData);

export const useChatData = () => useContext(ChatContext);

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [events, setEvents] = useState<StudentEvent[]>([]);
  const [favorites, setFavorites] = useState<StudentEvent[]>([]);
  const [registrations, setRegistrations] = useState<StudentEvent[]>([]);
  const [studentName, setStudentName] = useState<string>("Student");
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Fetch all data in parallel - these use existing services
      const [eventsData, favoritesData, enrollmentsData, profileData] = await Promise.allSettled([
        studentEventsService.getAllEvents({}),
        studentEventsService.getFavoriteEvents(),
        enrollmentService.getMyEnrollments(),
        profileService.getMyProfile(),
      ]);

      // Process events
      if (eventsData.status === "fulfilled") {
        setEvents(eventsData.value || []);
      }

      // Process favorites
      if (favoritesData.status === "fulfilled") {
        setFavorites(favoritesData.value || []);
      }

      // Process registrations - map enrollments to events
      if (enrollmentsData.status === "fulfilled" && enrollmentsData.value) {
        const mappedRegistrations = enrollmentsData.value
          .map((enr: any) => {
            const rawEvent = enr.events || enr.event;
            if (!rawEvent) return null;
            return mapApiEventToStudentEvent(rawEvent);
          })
          .filter((e: StudentEvent | null): e is StudentEvent => e !== null);
        setRegistrations(mappedRegistrations);
      }

      // Process profile
      if (profileData.status === "fulfilled" && profileData.value) {
        const profile = profileData.value;
        const name = profile.first_name || "Student";
        setStudentName(name);
      }
    } catch (error) {
      console.error("[ChatContext] Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const value: ChatContextValue = {
    events,
    favorites,
    registrations,
    studentName,
    isLoading,
    refreshData: fetchData,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export default ChatContext;
