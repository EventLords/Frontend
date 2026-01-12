import api from './api';

// =========================
// TYPES (based on backend responses)
// =========================

export interface Faculty {
  id_faculty: number;
  name: string;
  short_name: string | null;
}

export interface Specialization {
  id_specialization: number;
  name: string;
  faculty_id: number;
}

// =========================
// FACULTIES SERVICE
// =========================

export const facultiesService = {
  // GET /faculties
  async getAllFaculties(): Promise<Faculty[]> {
    const response = await api.get<Faculty[]>('/faculties');
    return response.data;
  },

  // GET /faculties/:id/specializations
  async getSpecializationsByFaculty(facultyId: number): Promise<Specialization[]> {
    const response = await api.get<Specialization[]>(`/faculties/${facultyId}/specializations`);
    return response.data;
  },
};

export default facultiesService;
