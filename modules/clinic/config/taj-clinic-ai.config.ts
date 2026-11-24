/**
 * @module @ssdc/clinic/config/taj-clinic-ai.config
 * @description
 * Connects Pillar 2 (Taj White Pearl Dental Clinic CRM) to Pillar 3 (Standalone Medical AI Agents SDK).
 * Dynamically syncs the live clinic doctor roster and dental procedure catalog into `MedicalFacilityConfig`.
 */

import {
  createMedicalFacilityConfig,
  DEFAULT_MEDICAL_FACILITY_CONFIG,
  MedicalFacilityConfig,
} from '@/modules/ai-agents';
import { Doctor } from '../domain/types';
import { DENTAL_PROCEDURES } from '../domain/dental-logic';

export function buildTajClinicAIConfig(doctors: Doctor[]): MedicalFacilityConfig {
  return createMedicalFacilityConfig({
    ...DEFAULT_MEDICAL_FACILITY_CONFIG,
    facilityId: 'ssdc-agra',
    facilityName: 'SSDC — Taj Mahal Dental Sanctuary, Agra',
    facilityShortName: 'SSDC Agra',
    voiceAgent: {
      ...DEFAULT_MEDICAL_FACILITY_CONFIG.voiceAgent,
      roleTitle: 'Patient Reception Desk',
      badgeText: 'Agra Direct Line',
      greetingMessage:
        'Namaste, thank you for calling SSDC Dental Clinic in Agra. How may I assist you with your appointment or dental inquiry today?',
    },
    whatsappAgent: {
      ...DEFAULT_MEDICAL_FACILITY_CONFIG.whatsappAgent,
      botName: 'SSDC Agra Patient Desk',
      subtitle: 'Direct Clinic Support & Appointments',
      avatarEmoji: 'S',
    },
    doctors: doctors
      .filter((d) => d.active)
      .map((d) => ({
        id: d.id,
        name: d.name,
        title: d.title,
        qualification: d.qualification,
        specialty: d.specialty,
        experienceYears: d.experienceYears,
        consultationFeeINR: d.consultationFeeINR,
        consultationFeeUSD: d.consultationFeeUSD,
        roomNumber: d.roomNumber,
        active: d.active,
      })),
    services: DENTAL_PROCEDURES.map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      durationMinutes: p.durationMinutes,
      priceINR: p.priceINR,
      priceUSD: p.priceUSD,
      description: p.description,
    })),
  });
}

