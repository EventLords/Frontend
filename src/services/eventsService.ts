import api from "./api";
import {
  Event,
  ApiResponse,
  PaginatedResponse,
  EventCategory,
  EventStatus,
} from "../types";

export interface EventFilters {
  category?: EventCategory;
  status?: EventStatus;
  startDate?: string;
  endDate?: string;
  search?: string;
  organizerId?: string;
}

export interface CreateEventData {
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  category: EventCategory;
  maxParticipants: number;
  imageUrl?: string;
}

export interface UpdateEventData extends Partial<CreateEventData> {
  status?: EventStatus;
}

export const eventsService = {
  // Get all events with optional filters and pagination
  async getEvents(
    page: number = 1,
    limit: number = 10,
    filters?: EventFilters
  ): Promise<PaginatedResponse<Event>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }

    const response = await api.get<PaginatedResponse<Event>>(
      `/events?${params}`
    );
    return response.data;
  },

  // ✅ ADDED: Get ALL events (for admin use)
  // Fetches a large list or specific admin endpoint if available
  async getAllEvents(): Promise<Event[]> {
    // Try to fetch a large number to simulate "all".
    // Ideally, backend should have /events/all or /admin/events
    const response = await api.get<PaginatedResponse<Event>>(
      "/events?limit=1000"
    );
    // If your backend returns pagination { data: [], meta: ... }, we return data.
    // If it returns an array directly, we handle that too.
    return response.data.data || (response.data as unknown as Event[]);
  },

  // Get single event by ID
  async getEvent(id: string): Promise<Event> {
    const response = await api.get<ApiResponse<Event>>(`/events/${id}`);
    return response.data.data;
  },

  // Create new event
  async createEvent(data: CreateEventData): Promise<Event> {
    const response = await api.post<ApiResponse<Event>>("/events", data);
    return response.data.data;
  },

  // Update event
  async updateEvent(id: string, data: UpdateEventData): Promise<Event> {
    const response = await api.put<ApiResponse<Event>>(`/events/${id}`, data);
    return response.data.data;
  },

  // Delete event
  async deleteEvent(id: string): Promise<void> {
    await api.delete(`/events/${id}`);
  },

  // Get popular/featured events
  async getPopularEvents(limit: number = 4): Promise<Event[]> {
    const response = await api.get<ApiResponse<Event[]>>(
      `/events/popular?limit=${limit}`
    );
    return response.data.data;
  },

  // Get upcoming events
  async getUpcomingEvents(limit: number = 10): Promise<Event[]> {
    const response = await api.get<ApiResponse<Event[]>>(
      `/events/upcoming?limit=${limit}`
    );
    return response.data.data;
  },

  // Get events for calendar (within date range)
  async getCalendarEvents(
    startDate: string,
    endDate: string
  ): Promise<Event[]> {
    const response = await api.get<ApiResponse<Event[]>>(
      `/events/calendar?startDate=${startDate}&endDate=${endDate}`
    );
    return response.data.data;
  },

  // Register for event
  async registerForEvent(eventId: string): Promise<{ qrCode: string }> {
    const response = await api.post<ApiResponse<{ qrCode: string }>>(
      `/events/${eventId}/register`
    );
    return response.data.data;
  },

  // Cancel registration
  async cancelRegistration(eventId: string): Promise<void> {
    await api.delete(`/events/${eventId}/register`);
  },

  // Check if user is registered for event
  async isRegistered(eventId: string): Promise<boolean> {
    const response = await api.get<ApiResponse<{ isRegistered: boolean }>>(
      `/events/${eventId}/registration-status`
    );
    return response.data.data.isRegistered;
  },

  // Get event participants (for organizers/admins)
  async getEventParticipants(
    eventId: string
  ): Promise<
    PaginatedResponse<{
      userId: string;
      name: string;
      email: string;
      status: string;
    }>
  > {
    const response = await api.get(`/events/${eventId}/participants`);
    return response.data;
  },

  // Approve event (admin only)
  async approveEvent(eventId: string): Promise<Event> {
    const response = await api.post<ApiResponse<Event>>(
      `/events/${eventId}/approve`
    );
    return response.data.data;
  },

  // Reject event (admin only)
  async rejectEvent(eventId: string, reason?: string): Promise<Event> {
    const response = await api.post<ApiResponse<Event>>(
      `/events/${eventId}/reject`,
      { reason }
    );
    return response.data.data;
  },
};

export default eventsService;
