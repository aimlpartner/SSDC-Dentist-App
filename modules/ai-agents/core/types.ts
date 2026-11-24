/**
 * @module @ssdc/medical-ai-agents/core/types
 * @description
 * Pillar 3 — Standalone, White-Label Medical AI Agents SDK Types.
 * Designed to be 100% domain-agnostic so ANY hospital, clinic, or healthcare CRM
 * (Dental, Cardiology, Dermatology, Eye Care, Multi-Specialty Hospital) can plug in
 * its facility configuration and CRM callbacks without modifying agent internals.
 */

export type AgentActionType =
  | 'none'
  | 'book_appointment'
  | 'reschedule_appointment'
  | 'cancel_appointment'
  | 'submit_review'
  | 'concierge_assist'
  | 'inquiry_answered';

export interface MedicalDoctorProfile {
  id: string;
  name: string;
  title?: string;
  qualification?: string;
  specialty: string;
  experienceYears?: number;
  consultationFeeINR?: number;
  consultationFeeUSD?: number;
  roomNumber?: string;
  active?: boolean;
}

export interface MedicalServiceItem {
  id: string;
  name: string;
  category: string;
  durationMinutes?: number;
  priceINR?: number;
  priceUSD?: number;
  description: string;
  notes?: string;
}

export interface MedicalAppointmentRecord {
  id: string;
  appointmentNumber: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  patientType: 'local' | 'international';
  country: string;
  doctorId: string;
  doctorName: string;
  date: string;
  timeSlot: string;
  problemCategory: string;
  problemDescription: string;
  status: 'confirmed' | 'arrived' | 'in_chair' | 'completed' | 'rescheduled' | 'cancelled';
  bookingSource: 'website' | 'call_agent' | 'whatsapp' | 'reception_walkin';
  createdAt: string;
  estimatedCostINR?: number;
  estimatedCostUSD?: number;
  rating?: number;
  reviewFeedback?: string;
}

export interface VoiceAgentPersonaConfig {
  /** Agent display name, e.g., "Priya" or "Dr. Aria" */
  name: string;
  /** Role subtitle, e.g., "AI Dental Calling Concierge" or "Hospital Voice Receptionist" */
  roleTitle: string;
  /** Badge pill text, e.g., "Agra 24/7 Line" */
  badgeText: string;
  /** Initial spoken & displayed greeting when call connects */
  greetingMessage: string;
  /** Personality instructions injected into the LLM system prompt */
  personalityTraits: string[];
  /** Quick tap-to-speak prompts displayed in the call UI */
  quickPrompts: string[];
  /** Web Speech API pitch (default 1.05) */
  voicePitch?: number;
  /** Web Speech API rate (default 1.0) */
  voiceRate?: number;
}

export interface WhatsAppQuickAction {
  label: string;
  action: 'reschedule_auto' | 'rate_visit' | 'concierge_shuttle' | 'open_calling' | string;
  promptText?: string;
}

export interface WhatsAppAgentPersonaConfig {
  /** Display name in the WhatsApp header */
  botName: string;
  /** Subtitle in the WhatsApp header */
  subtitle: string;
  /** Avatar icon/emoji */
  avatarEmoji: string;
  /** End-to-end encryption notice banner */
  encryptionNotice: string;
  /** Secondary proactive reminder message shown on chat open */
  reminderNotice: string;
  /** Quick interactive action chips attached to the welcome message */
  quickActions: WhatsAppQuickAction[];
}

export interface MedicalFacilityConfig {
  /** Unique identifier for the hospital/clinic tenant */
  facilityId: string;
  /** Full legal/brand name of the medical facility */
  facilityName: string;
  /** Short conversational name of the facility */
  facilityShortName: string;
  /** Medical specialty domain, e.g., "Dentistry & Cosmetic Smile Care", "Cardiology", "General Hospital" */
  medicalDomain: string;
  /** Physical location & contact metadata */
  location: {
    city: string;
    address: string;
    landmark?: string;
    phone?: string;
    email?: string;
  };
  /** Prefix used when generating appointment numbers, e.g., "TWP" -> "TWP-8492" */
  appointmentPrefix: string;
  /** Default problem/consultation label when caller books via voice/chat */
  defaultConsultationCategory: string;
  /** Default estimated consultation cost */
  defaultConsultationCost: {
    inr: number;
    usd: number;
  };
  /** Active doctors / specialists at the facility */
  doctors: MedicalDoctorProfile[];
  /** Clinical procedures / services offered by the facility */
  services: MedicalServiceItem[];
  /** Concierge, travel, insurance, or hospital perks to mention in inquiries */
  conciergeHighlights: string[];
  /** Emergency & walk-in policy description */
  emergencyPolicy: string;
  /** Agent 1: Voice Calling Agent Persona & UI Config */
  voiceAgent: VoiceAgentPersonaConfig;
  /** Agent 2: WhatsApp Concierge Agent Persona & UI Config */
  whatsappAgent: WhatsAppAgentPersonaConfig;
}

/**
 * Standardized CRM Adapter Interface.
 * Any hospital or clinic with an existing CRM/EHR can pass these callbacks
 * to connect the AI Agents directly to their database or REST APIs.
 */
export interface MedicalCRMAdapter<
  TAppointment extends MedicalAppointmentRecord = MedicalAppointmentRecord,
  TDoctor extends MedicalDoctorProfile = MedicalDoctorProfile
> {
  appointments: TAppointment[];
  doctors: TDoctor[];
  onBookAppointment?: (appointment: TAppointment) => void | Promise<void>;
  onRescheduleAppointment?: (
    appointmentNumber: string,
    newDate: string,
    newTime: string
  ) => boolean | Promise<boolean>;
  onCancelAppointment?: (appointmentNumber: string) => boolean | Promise<boolean>;
  onAddReview?: (
    appointmentNumber: string,
    rating: number,
    feedback: string
  ) => void | Promise<void>;
  onOpenCallingAgent?: () => void;
}

export interface AgentConversationMessage {
  id: string;
  role: 'agent' | 'user' | 'system';
  text: string;
  timestamp: string;
}

export interface ExtractedAgentData {
  patientName?: string | null;
  doctorName?: string | null;
  problem?: string | null;
  requestedDate?: string | null;
  requestedTime?: string | null;
  appointmentNumber?: string | null;
  isInternational?: boolean;
  rating?: number | null;
  reviewFeedback?: string | null;
}

export interface AgentEngineRequest {
  channel: 'voice' | 'whatsapp';
  transcript: string;
  conversationHistory?: { role: 'agent' | 'user' | 'system'; text: string }[];
  callerInfo?: {
    name?: string;
    phone?: string;
    isInternational?: boolean;
    existingAppointmentNumber?: string;
  };
  /** Optional custom facility config for multi-tenant / external hospital integrations */
  facilityConfig?: MedicalFacilityConfig;
}

export interface AgentEngineResponse {
  reply: string;
  action: AgentActionType;
  extractedData?: ExtractedAgentData;
  suggestedQuickActions?: WhatsAppQuickAction[];
}

