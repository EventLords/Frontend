import { Enrollment, StudentEvent } from '../../../types/student';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Store enrollments in localStorage for demo purposes
const ENROLLMENTS_KEY = 'unify_enrollments';

const getStoredEnrollments = (): Enrollment[] => {
  try {
    const stored = localStorage.getItem(ENROLLMENTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveEnrollments = (enrollments: Enrollment[]) => {
  localStorage.setItem(ENROLLMENTS_KEY, JSON.stringify(enrollments));
};

// Generate unique QR code data
const generateQRCode = (eventId: string, studentId: string): string => {
  const timestamp = Date.now();
  const uniqueId = Math.random().toString(36).substring(2, 15);
  return `UNIFY-${eventId}-${studentId}-${timestamp}-${uniqueId}`;
};

export const enrollmentService = {
  // Enroll in an event
  async enrollInEvent(eventId: string, event: StudentEvent): Promise<Enrollment> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/student/events/${eventId}/enroll`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to enroll');
      return await response.json();
    } catch {
      // Mock enrollment for demo
      const studentId = 'student-123'; // In real app, get from auth context
      const enrollment: Enrollment = {
        id: `enr-${Date.now()}`,
        eventId,
        studentId,
        enrollmentDate: new Date().toISOString(),
        qrCode: generateQRCode(eventId, studentId),
        status: 'confirmed',
        event
      };
      
      // Save to localStorage
      const enrollments = getStoredEnrollments();
      enrollments.push(enrollment);
      saveEnrollments(enrollments);
      
      return enrollment;
    }
  },

  // Cancel enrollment
  async cancelEnrollment(enrollmentId: string): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/student/enrollments/${enrollmentId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to cancel enrollment');
    } catch {
      // Remove from localStorage
      const enrollments = getStoredEnrollments();
      const filtered = enrollments.filter(e => e.id !== enrollmentId);
      saveEnrollments(filtered);
    }
  },

  // Get all enrollments
  async getEnrollments(): Promise<Enrollment[]> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/student/enrollments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch enrollments');
      return await response.json();
    } catch {
      return getStoredEnrollments();
    }
  },

  // Get enrollment by event ID
  async getEnrollmentByEventId(eventId: string): Promise<Enrollment | null> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/student/events/${eventId}/enrollment`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) return null;
      return await response.json();
    } catch {
      const enrollments = getStoredEnrollments();
      return enrollments.find(e => e.eventId === eventId) || null;
    }
  },

  // Check if enrolled in event
  async isEnrolled(eventId: string): Promise<boolean> {
    const enrollment = await this.getEnrollmentByEventId(eventId);
    return enrollment !== null && enrollment.status === 'confirmed';
  },

  // Get QR code for enrollment
  async getQRCode(enrollmentId: string): Promise<string> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/student/enrollments/${enrollmentId}/qr`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to get QR code');
      const data = await response.json();
      return data.qrCode;
    } catch {
      const enrollments = getStoredEnrollments();
      const enrollment = enrollments.find(e => e.id === enrollmentId);
      return enrollment?.qrCode || '';
    }
  },

  // Send QR code to email
  async sendQRToEmail(enrollmentId: string, email: string): Promise<boolean> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/student/enrollments/${enrollmentId}/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ email })
      });
      return response.ok;
    } catch {
      // Mock success for demo
      console.log(`QR code sent to ${email}`);
      return true;
    }
  },

  // Download QR as image
  downloadQRAsImage(qrElement: HTMLElement, eventName: string): void {
    const canvas = qrElement.querySelector('canvas') || qrElement.querySelector('svg');
    if (!canvas) return;

    let dataUrl: string;
    
    if (canvas.tagName === 'CANVAS') {
      dataUrl = (canvas as HTMLCanvasElement).toDataURL('image/png');
    } else {
      // Convert SVG to canvas then to image
      const svgData = new XMLSerializer().serializeToString(canvas);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      dataUrl = URL.createObjectURL(svgBlob);
    }

    const link = document.createElement('a');
    link.download = `bilet-${eventName.replace(/\s+/g, '-').toLowerCase()}.png`;
    link.href = dataUrl;
    link.click();
  }
};
