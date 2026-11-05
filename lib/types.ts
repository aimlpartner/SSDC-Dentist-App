export type PatientType = 'local' | 'international';

export type AppointmentStatus = 
  | 'confirmed' 
  | 'arrived' 
  | 'in_chair' 
  | 'completed' 
  | 'rescheduled' 
  | 'cancelled';

export type BookingSource = 
  | 'website' 
  | 'call_agent' 
  | 'whatsapp' 
  | 'reception_walkin';

export interface Doctor {
  id: string;
  name: string;
  title: string;
  qualification: string;
  specialty: string;
  experienceYears: number;
  bio: string;
  avatarUrl: string;
  consultationFeeINR: number;
  consultationFeeUSD: number;
  rating: number;
  reviewCount: number;
  availableDays: string[];
  availableHours: string;
  roomNumber: string;
  active: boolean;
}

export interface Patient {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  type: PatientType;
  country: string;
  city?: string;
  passportNumber?: string;
  medicalAlerts?: string[];
  allergies?: string[];
  createdAt: string;
  totalVisits: number;
  avatarUrl?: string;
}

export interface DentalTourismDetails {
  arrivalDate?: string;
  departureDate?: string;
  hotelInAgra?: string;
  airportPickupRequired?: boolean;
  packageType?: 'Taj Pearl Smile Makeover' | 'German Zirconia Implant Vacation' | 'Veneer Artistry' | 'Express Hygiene & Whitening';
  companionCount?: number;
  specialDietaryOrMobilityNotes?: string;
}

export interface Appointment {
  id: string;
  appointmentNumber: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  patientType: PatientType;
  country: string;
  doctorId: string;
  doctorName: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "10:00 AM"
  problemCategory: string; // e.g. "Teeth Whitening", "Severe Toothache", "Dental Implants", "Smile Makeover", "Routine Clean"
  problemDescription: string;
  status: AppointmentStatus;
  bookingSource: BookingSource;
  tourismDetails?: DentalTourismDetails;
  clinicalNotes?: string;
  prescriptions?: string[];
  estimatedCostUSD?: number;
  estimatedCostINR?: number;
  createdAt: string;
  rating?: number;
  reviewFeedback?: string;
}

export type NotificationChannel = 'email' | 'whatsapp';

export type NotificationTrigger = 
  | 'booking_confirmation' 
  | 'reminder_24h' 
  | 'reminder_2h' 
  | 'post_treatment_rating' 
  | 'recall_checkup';

export interface NotificationLog {
  id: string;
  appointmentId: string;
  appointmentNumber: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  channel: NotificationChannel;
  trigger: NotificationTrigger;
  subject: string;
  messageContent: string;
  sentAt: string;
  status: 'delivered' | 'read' | 'pending';
  responseReceived?: string;
}

export interface CallMessage {
  id: string;
  role: 'agent' | 'user' | 'system';
  text: string;
  timestamp: string;
}

export interface CallSession {
  id: string;
  callerName?: string;
  callerPhone?: string;
  status: 'idle' | 'calling' | 'connected' | 'ended';
  startedAt?: string;
  durationSeconds: number;
  messages: CallMessage[];
  detectedIntent?: string;
  actionSummary?: string;
}
