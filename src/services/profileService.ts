import api from "./api";

// =========================
// TYPES (based on backend responses)
// =========================

export interface UserProfile {
  id_user: number;
  email: string;
  role: "STUDENT" | "ORGANIZER" | "ADMIN";
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  organization_name: string | null;
  organization_type: string | null;
  organization_description: string | null;
  faculty_id: number | null;
  specialization_id: number | null;
  study_cycle: string | null;
  study_year: number | null;
  isApproved: boolean;
  isRejected: boolean;
  created_at: string;
}

export interface UpdateStudentDto {
  firstName?: string;
  lastName?: string;
  facultyId?: number;
  specializationId?: number;
  studyCycle?: string;
  studyYear?: number;
}

export interface UpdateOrganizerDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
  organizationName?: string;
  organizationDescription?: string;
}

export interface UpdateAdminDto {
  firstName?: string;
  lastName?: string;
}

// =========================
// PROFILE SERVICE
// =========================

export const profileService = {
  // GET /profile/me
  async getMyProfile(): Promise<UserProfile> {
    const response = await api.get<UserProfile>("/profile/me");
    return response.data;
  },

  // PATCH /profile/me (for students)
  async updateStudentProfile(data: UpdateStudentDto): Promise<UserProfile> {
    const response = await api.patch<UserProfile>("/profile/me", data);
    return response.data;
  },

  // PATCH /profile/me (for organizers)
  async updateOrganizerProfile(data: UpdateOrganizerDto): Promise<UserProfile> {
    const response = await api.patch<UserProfile>("/profile/me", data);
    return response.data;
  },

  // PATCH /profile/me (for admins)
  async updateAdminProfile(data: UpdateAdminDto): Promise<UserProfile> {
    const response = await api.patch<UserProfile>("/profile/me", data);
    return response.data;
  },

  // Generic update (role-agnostic)
  async updateProfile(
    data: UpdateStudentDto | UpdateOrganizerDto | UpdateAdminDto
  ): Promise<UserProfile> {
    const response = await api.patch<UserProfile>("/profile/me", data);
    return response.data;
  },

  // Change Password
  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await api.patch("/profile/change-password", {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  // ✅ ADDED: Delete Account Method
  async deleteAccount(): Promise<void> {
    await api.delete("/profile/me");
  },
};

export default profileService;
