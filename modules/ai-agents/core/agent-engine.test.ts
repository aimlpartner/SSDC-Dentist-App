import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createMedicalFacilityConfig,
  DEFAULT_MEDICAL_FACILITY_CONFIG,
} from './default-facility.config.ts';
import {
  buildVoiceAgentSystemPrompt,
  buildWhatsAppAgentSystemPrompt,
} from './prompt-builder.ts';
import {
  evaluateVoiceAgentFallback,
  evaluateWhatsAppAgentFallback,
  generateFacilityAppointmentCode,
} from './agent-engine.ts';

test('Pillar 3 SDK: default facility config works out of the box', () => {
  assert.equal(DEFAULT_MEDICAL_FACILITY_CONFIG.appointmentPrefix, 'TWP');
  assert.equal(DEFAULT_MEDICAL_FACILITY_CONFIG.voiceAgent.name, 'Priya');
  const code = generateFacilityAppointmentCode(DEFAULT_MEDICAL_FACILITY_CONFIG.appointmentPrefix);
  assert.ok(code.startsWith('TWP-'));
});

test('Pillar 3 SDK: can be white-labeled for any non-dental hospital (e.g., Cardiology Institute)', () => {
  const cardiologyConfig = createMedicalFacilityConfig({
    facilityId: 'apollo-heart-delhi',
    facilityName: 'Apollo Heart & Vascular Institute',
    facilityShortName: 'Apollo Heart Institute',
    medicalDomain: 'Cardiology & Interventional Vascular Care',
    location: {
      city: 'New Delhi, India',
      address: 'Sarita Vihar, Mathura Road, New Delhi',
    },
    appointmentPrefix: 'AHVI',
    defaultConsultationCategory: 'Cardiac Consultation & ECG',
    doctors: [
      {
        id: 'doc-kapoor',
        name: 'Dr. Siddharth Kapoor',
        title: 'Chief Interventional Cardiologist',
        specialty: 'Coronary Angiography & Preventive Cardiology',
        experienceYears: 22,
      },
    ],
    services: [
      {
        id: 'srv-echo',
        name: '3D Echocardiography & Stress Screening',
        category: 'Diagnostics',
        durationMinutes: 40,
        priceINR: 4500,
        priceUSD: 60,
        description: 'Comprehensive non-invasive cardiac imaging and valve evaluation.',
      },
    ],
    voiceAgent: {
      ...DEFAULT_MEDICAL_FACILITY_CONFIG.voiceAgent,
      name: 'Aria',
      roleTitle: 'AI Cardiac Care Coordinator',
      badgeText: 'Delhi 24/7 Cardiac Desk',
      greetingMessage: 'Hello and welcome to Apollo Heart Institute! I am Aria. How may I assist you?',
    },
  });

  // 1. Prompt builder dynamically injects Cardiology hospital details
  const voicePrompt = buildVoiceAgentSystemPrompt(cardiologyConfig);
  assert.ok(voicePrompt.includes('Apollo Heart & Vascular Institute'));
  assert.ok(voicePrompt.includes('Dr. Siddharth Kapoor'));
  assert.ok(voicePrompt.includes('3D Echocardiography & Stress Screening'));
  assert.ok(voicePrompt.includes('AHVI-1042'));

  const waPrompt = buildWhatsAppAgentSystemPrompt(cardiologyConfig);
  assert.ok(waPrompt.includes('Apollo Heart & Vascular Institute'));

  // 2. Voice agent fallback dynamically responds for Cardiology hospital
  const bookResponse = evaluateVoiceAgentFallback(
    'I want to book an appointment with Dr. Siddharth Kapoor',
    cardiologyConfig
  );
  assert.equal(bookResponse.action, 'book_appointment');
  assert.ok(bookResponse.reply.includes('Apollo Heart Institute'));
  assert.ok(bookResponse.reply.includes('Dr. Siddharth Kapoor'));

  // 3. WhatsApp agent fallback dynamically responds for Cardiology hospital
  const waReschedule = evaluateWhatsAppAgentFallback(
    'Please reschedule my appointment',
    cardiologyConfig,
    { appointmentNumber: 'AHVI-2099', doctorName: 'Dr. Siddharth Kapoor' }
  );
  assert.equal(waReschedule.action, 'reschedule_appointment');
  assert.ok(waReschedule.reply.includes('AHVI-2099'));
  assert.ok(waReschedule.reply.includes('Apollo Heart Institute'));
});
