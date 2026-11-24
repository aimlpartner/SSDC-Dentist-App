/**
 * @module @ssdc/medical-ai-agents/core/default-facility.config
 * @description
 * Default facility configuration preset & factory helper (`createMedicalFacilityConfig`).
 * Allows any hospital or clinic to configure the Voice & WhatsApp AI Agents via JSON/config
 * while providing a ready-to-use default preset out of the box.
 */

import type { MedicalFacilityConfig } from './types.ts';

export const DEFAULT_MEDICAL_FACILITY_CONFIG: MedicalFacilityConfig = {
  facilityId: 'ssdc-agra',
  facilityName: 'SSDC — Taj Mahal Dental Sanctuary, Agra',
  facilityShortName: 'SSDC Agra',
  medicalDomain: 'Dentistry, Implantology & Cosmetic Smile Care',
  location: {
    city: 'Agra, India',
    address: 'Karim Complex, Fatehabad Rd, opposite Pizza Hut, Khairati Tola, Tajganj, Agra 282001',
    landmark: 'Opposite Pizza Hut on Fatehabad Road, minutes from Taj East Gate',
    phone: '+91 94157 66886',
    email: 'drsapna.ds@gmail.com',
  },
  appointmentPrefix: 'TWP',
  defaultConsultationCategory: 'SSDC Agra Consultation',
  defaultConsultationCost: {
    inr: 200,
    usd: 15,
  },
  doctors: [
    {
      id: 'doc-saurabh',
      name: 'Dr. Saurabh',
      title: 'Co-Founder, Senior Dental Surgeon & Conservative Dentist',
      qualification: 'BDS (BBD College of Dental Sciences), IDA Member',
      specialty: 'Conservative Dentistry, Root Canal, Implants & Crowns',
      experienceYears: 18,
      consultationFeeINR: 200,
      consultationFeeUSD: 15,
      roomNumber: 'Suite 101',
      active: true,
    },
    {
      id: 'doc-sapna',
      name: 'Dr. Sapna',
      title: 'Co-Founder & Senior Dental Surgeon',
      qualification: 'BDS, Cosmetic & Family Dentistry',
      specialty: 'Gentle Root Canal, Aesthetic Veneers & Smile Care',
      experienceYears: 15,
      consultationFeeINR: 200,
      consultationFeeUSD: 15,
      roomNumber: 'Suite 102',
      active: true,
    },
  ],
  services: [
    {
      id: 'proc-whitening',
      name: 'Taj Pearl Laser Whitening',
      category: 'Cosmetic',
      durationMinutes: 45,
      priceINR: 12000,
      priceUSD: 145,
      description: 'Instant 6-8 shade brightening using gentle cold-light laser. Zero downtime; can visit Taj Mahal same day.',
    },
    {
      id: 'proc-veneers',
      name: 'Porcelain Smile Veneers (Per Tooth)',
      category: 'Cosmetic',
      durationMinutes: 90,
      priceINR: 18000,
      priceUSD: 220,
      description: 'Ultra-thin E-max porcelain handcrafted by master ceramists.',
    },
    {
      id: 'proc-implants',
      name: 'German Zirconia / Titanium Implants',
      category: 'Surgical & Restorative',
      durationMinutes: 60,
      priceINR: 42000,
      priceUSD: 520,
      description: 'Lifetime warranted dental implant placement with 3D CBCT computer-guided precision (70% savings vs UK/US).',
    },
    {
      id: 'proc-root-canal',
      name: 'Microscopic Painless Root Canal',
      category: 'Endodontics',
      durationMinutes: 60,
      priceINR: 8500,
      priceUSD: 110,
      description: 'Single-sitting laser-assisted root canal preserving natural tooth structure.',
    },
    {
      id: 'proc-aligners',
      name: 'Taj Clear Invisible Aligners',
      category: 'Orthodontics',
      durationMinutes: 45,
      priceINR: 65000,
      priceUSD: 790,
      description: 'Digital 3D mapped orthodontic aligners for discreet smile alignment.',
    },
  ],
  conciergeHighlights: [
    'Free private airport transfers from Delhi (IGI) or Agra Cantt railway station',
    'Luxury hospitality tie-ups with The Oberoi Amarvilas, ITC Mughal, and Tajview Agra',
    'Flexible clinical appointments timed around Taj Mahal sunrise visits (6:15 AM - 7:30 AM)',
  ],
  emergencyPolicy: 'Same-day acute pain relief and walk-in OPD intake welcome at our clinical suites.',
  voiceAgent: {
    name: 'Priya',
    roleTitle: 'Patient Reception Desk',
    badgeText: 'Direct Clinic Line',
    greetingMessage:
      'Namaste, thank you for calling SSDC Dental Clinic, Agra. How may I help with your appointment today?',
    personalityTraits: [
      'Warm, polite, natural, and reassuring like a real front-desk patient coordinator.',
      'Keep spoken replies concise, natural, and conversational (1-3 sentences), suitable for phone conversation.',
      'Do NOT say you are an AI, bot, or virtual assistant. Do NOT use markdown asterisks (*, **), bullet lists, or URLs.',
    ],
    quickPrompts: [
      'I want to book an appointment with Dr. Saurabh for dental implants',
      'How much does laser teeth whitening cost?',
      'Can I reschedule my appointment to a later slot?',
      'Do you arrange airport pickup from Delhi and hotels near the Taj Mahal?',
      'I have severe toothache and need to come in today',
      'I need to cancel my appointment',
    ],
    voicePitch: 1.05,
    voiceRate: 1.0,
  },
  whatsappAgent: {
    botName: 'SSDC Agra Front Desk',
    subtitle: 'Clinic Reception & Patient Support',
    avatarEmoji: 'S',
    encryptionNotice:
      'Messages are private and encrypted with SSDC Agra Patient Records.',
    reminderNotice:
      '*Visit Reminder:*\nYour consultation is coming up. If you need hotel transfer details or want to adjust your timing, just reply here anytime.',
    quickActions: [
      { label: 'Reschedule to Tomorrow', action: 'reschedule_auto' },
      { label: 'Rate My Visit', action: 'rate_visit' },
      { label: 'Hotel / Taj Pickup Details', action: 'hotel_shuttle' },
      { label: 'Call Clinic Reception', action: 'open_calling' },
    ],
  },
};

/**
 * Helper factory to create a custom `MedicalFacilityConfig` for any hospital or clinic
 * by merging partial overrides onto sensible medical defaults.
 */
export function createMedicalFacilityConfig(
  overrides: Partial<MedicalFacilityConfig> & Pick<MedicalFacilityConfig, 'facilityId' | 'facilityName'>
): MedicalFacilityConfig {
  return {
    ...DEFAULT_MEDICAL_FACILITY_CONFIG,
    ...overrides,
    location: {
      ...DEFAULT_MEDICAL_FACILITY_CONFIG.location,
      ...(overrides.location || {}),
    },
    voiceAgent: {
      ...DEFAULT_MEDICAL_FACILITY_CONFIG.voiceAgent,
      ...(overrides.voiceAgent || {}),
    },
    whatsappAgent: {
      ...DEFAULT_MEDICAL_FACILITY_CONFIG.whatsappAgent,
      ...(overrides.whatsappAgent || {}),
    },
  };
}
