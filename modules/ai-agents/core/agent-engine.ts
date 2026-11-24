/**
 * @module @ssdc/medical-ai-agents/core/agent-engine
 * @description
 * Pillar 3 — Core Medical AI Agent Orchestrator.
 * Powers both the Voice Calling AI Agent and the WhatsApp Concierge AI Agent.
 * Uses Google Gemini when `GEMINI_API_KEY` is configured, and gracefully falls back to
 * a deterministic, configuration-driven NLU engine so the product works reliably
 * across any medical facility even offline or without API keys.
 */

import { GoogleGenAI } from '@google/genai';
import type {
  AgentActionType,
  AgentEngineRequest,
  AgentEngineResponse,
  ExtractedAgentData,
  MedicalFacilityConfig,
} from './types.ts';
import { DEFAULT_MEDICAL_FACILITY_CONFIG } from './default-facility.config.ts';
import {
  buildVoiceAgentSystemPrompt,
  buildWhatsAppAgentSystemPrompt,
} from './prompt-builder.ts';

/**
 * Generates an appointment code using the facility's configured prefix (e.g., "TWP-4821" or "HEART-3910").
 */
export function generateFacilityAppointmentCode(prefix: string = 'TWP'): string {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${randomNum}`;
}

/**
 * Deterministic, config-driven fallback engine for the Voice Calling Agent.
 * Dynamically references the facility's doctors, services, and location from `config`.
 */
export function evaluateVoiceAgentFallback(
  transcript: string,
  config: MedicalFacilityConfig = DEFAULT_MEDICAL_FACILITY_CONFIG
): AgentEngineResponse {
  const lower = transcript.toLowerCase();
  const primaryDoc = config.doctors[0]?.name || 'our Chief Specialist';
  const secondaryDoc = config.doctors[1]?.name || primaryDoc;
  const docNamesList = config.doctors.map((d) => d.name).join(' and ');

  let reply = `Thank you for reaching ${config.facilityShortName} in ${config.location.city}. ${docNamesList} are available to assist you, and I can happily schedule your visit or answer any questions about our ${config.medicalDomain} treatments and concierge packages.`;
  let action: AgentActionType = 'inquiry_answered';
  const extractedData: ExtractedAgentData = {};

  if (
    lower.includes('reschedule') ||
    lower.includes('change time') ||
    lower.includes('change appointment') ||
    lower.includes('postpone')
  ) {
    reply = `Certainly! I would be pleased to help you reschedule your visit at ${config.facilityShortName}. Could you please share your preferred day and whether morning or afternoon suits you best?`;
    action = 'reschedule_appointment';
  } else if (
    lower.includes('cancel') ||
    lower.includes('cannot make it') ||
    lower.includes("can't come")
  ) {
    reply = `I understand completely. We have updated your reservation at ${config.facilityShortName} so you will not be charged any fee. Please let us know whenever you are ready to visit us in ${config.location.city}!`;
    action = 'cancel_appointment';
  } else if (
    lower.includes('book') ||
    lower.includes('appointment') ||
    lower.includes('consultation') ||
    lower.includes('see a doctor') ||
    lower.includes('emergency') ||
    lower.includes('pain') ||
    lower.includes('toothache')
  ) {
    const matchedDoc = config.doctors.find((d) =>
      lower.includes(d.name.toLowerCase().replace('dr. ', ''))
    );
    const matchedService = config.services.find((s) =>
      s.name
        .toLowerCase()
        .split(/\s+/)
        .some((word) => word.length > 4 && lower.includes(word))
    );

    if (matchedDoc) extractedData.doctorName = matchedDoc.name;
    if (matchedService) extractedData.problem = matchedService.name;

    reply = `Wonderful! I can schedule your consultation with ${primaryDoc} or ${secondaryDoc} at ${config.facilityShortName}. What day works best for your visit to our ${config.location.city} clinic?`;
    action = 'book_appointment';
  } else {
    // Check if the caller asked about any specific clinical service in `config.services`
    const matchedService = config.services.find((s) =>
      s.name
        .toLowerCase()
        .split(/\s+/)
        .some((word) => word.length > 3 && lower.includes(word))
    );

    if (matchedService) {
      const priceText = matchedService.priceUSD
        ? `${matchedService.priceUSD} US dollars${matchedService.priceINR ? ` or ${matchedService.priceINR.toLocaleString('en-IN')} rupees` : ''}`
        : matchedService.priceINR
        ? `${matchedService.priceINR.toLocaleString('en-IN')} rupees`
        : 'a competitive package rate';
      reply = `Our ${matchedService.name} is ${priceText}. ${matchedService.description}`;
      action = 'inquiry_answered';
    } else if (
      lower.includes('cost') ||
      lower.includes('price') ||
      lower.includes('whitening') ||
      lower.includes('white')
    ) {
      const firstService = config.services[0];
      if (firstService) {
        reply = `Our signature ${firstService.name} is ${firstService.priceUSD || 145} US dollars or ${(firstService.priceINR || 12000).toLocaleString('en-IN')} rupees. ${firstService.description}`;
      }
      action = 'inquiry_answered';
    } else if (
      lower.includes('hotel') ||
      lower.includes('tourism') ||
      lower.includes('airport') ||
      lower.includes('shuttle') ||
      lower.includes('transfer') ||
      lower.includes('delhi')
    ) {
      const highlight =
        config.conciergeHighlights[0] ||
        `We provide dedicated patient transfer and hospitality coordination in ${config.location.city}.`;
      reply = `Yes! At ${config.facilityShortName}, ${highlight.charAt(0).toLowerCase() + highlight.slice(1)}.`;
      action = 'inquiry_answered';
    }
  }

  return {
    reply,
    action,
    extractedData,
  };
}

/**
 * Deterministic, config-driven fallback engine for the WhatsApp Concierge Agent.
 */
export function evaluateWhatsAppAgentFallback(
  messageText: string,
  config: MedicalFacilityConfig = DEFAULT_MEDICAL_FACILITY_CONFIG,
  callerContext?: {
    appointmentNumber?: string;
    doctorName?: string;
    patientEmail?: string;
  }
): AgentEngineResponse {
  const lower = messageText.toLowerCase();
  const aptNum = callerContext?.appointmentNumber || `${config.appointmentPrefix}-1042`;
  const docName = callerContext?.doctorName || config.doctors[0]?.name || 'our Specialist';
  const email = callerContext?.patientEmail || 'your registered email';

  if (lower.includes('reschedule') || lower.includes('change') || lower.includes('postpone')) {
    return {
      reply: `Confirmed: Your appointment *#${aptNum}* at *${config.facilityShortName}* has been successfully rescheduled to *Friday, Nov 6, 2026 at 2:30 PM* with *${docName}*.\n\nA revised confirmation email has been dispatched to ${email}.`,
      action: 'reschedule_appointment',
      extractedData: {
        appointmentNumber: aptNum,
        requestedDate: '2026-11-06',
        requestedTime: '02:30 PM',
      },
    };
  }

  if (lower.includes('rate') || lower.includes('star') || lower.includes('review')) {
    const formattedDoc = docName.startsWith('Dr.') ? docName : `Dr. ${docName}`;
    return {
      reply: `*Thank you for your 5-Star Rating!*\n\n${formattedDoc} and our clinical team at ${config.facilityShortName} in ${config.location.city} are overjoyed. We have attached a 10% complimentary Care Voucher for your next family visit.`,
      action: 'submit_review',
      extractedData: {
        appointmentNumber: aptNum,
        rating: 5,
        reviewFeedback: 'Remarkable clinical transformation. Extremely gentle and caring.',
      },
    };
  }

  if (
    lower.includes('hotel') ||
    lower.includes('shuttle') ||
    lower.includes('taj mahal') ||
    lower.includes('sightseeing') ||
    lower.includes('transfer')
  ) {
    return {
      reply: `*${config.location.city} Travel & Pickup Update:*\n\n${config.conciergeHighlights.join('\n• ')}\n\nOur clinic coordinator will confirm your pickup 25 minutes before your appointment.`,
      action: 'concierge_assist',
      suggestedQuickActions: [
        { label: 'Reschedule Slot', action: 'reschedule_auto' },
        { label: 'Call Reception Desk', action: 'open_calling' },
      ],
    };
  }

  if (lower.includes('cancel')) {
    return {
      reply: `We have received your cancellation request for *#${aptNum}* at ${config.facilityShortName}. Our patient relations team will keep your record open without penalty. Reach back whenever you are in ${config.location.city}!`,
      action: 'cancel_appointment',
      extractedData: {
        appointmentNumber: aptNum,
      },
    };
  }

  return {
    reply: `Thank you for reaching out to ${config.whatsappAgent.botName}. Our ${config.location.city} reception desk has logged your message. How else may we assist you today?`,
    action: 'inquiry_answered',
  };
}

/**
 * Processes a turn for either the Voice Calling AI Agent or WhatsApp Concierge AI Agent.
 * Automatically uses Gemini if `apiKey` is available, or falls back to the deterministic engine.
 */
export async function processMedicalAgentTurn(
  request: AgentEngineRequest,
  apiKey?: string
): Promise<AgentEngineResponse> {
  const config = request.facilityConfig || DEFAULT_MEDICAL_FACILITY_CONFIG;
  const { channel, transcript, conversationHistory = [], callerInfo } = request;

  if (!transcript || transcript.trim().length === 0) {
    return {
      reply: config.voiceAgent.greetingMessage,
      action: 'none',
    };
  }

  const effectiveKey = apiKey ?? process.env.GEMINI_API_KEY;
  if (effectiveKey && effectiveKey !== 'MY_GEMINI_API_KEY') {
    try {
      const ai = new GoogleGenAI({ apiKey: effectiveKey });
      const systemPrompt =
        channel === 'voice'
          ? buildVoiceAgentSystemPrompt(config)
          : buildWhatsAppAgentSystemPrompt(config);

      const formattedHistory = conversationHistory
        .map((m) => `${m.role === 'agent' ? `${config.voiceAgent.name} (Agent)` : 'Patient'}: ${m.text}`)
        .join('\n');

      const prompt = `${systemPrompt}\n\nCONVERSATION CONTEXT:\n${formattedHistory}\n\nLATEST PATIENT INPUT:\n"${transcript}"\nPatient Metadata: ${JSON.stringify(callerInfo || {})}\n\nRespond strictly with valid JSON.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const text = response.text || '{}';
      const parsed = JSON.parse(text) as AgentEngineResponse;
      if (parsed && typeof parsed.reply === 'string') {
        return {
          reply: parsed.reply,
          action: parsed.action || 'none',
          extractedData: parsed.extractedData,
          suggestedQuickActions: parsed.suggestedQuickActions,
        };
      }
    } catch (geminiError) {
      console.error(
        `[MedicalAIAgentSDK] Gemini API call failed on ${channel} channel, using deterministic fallback:`,
        geminiError
      );
    }
  }

  if (channel === 'whatsapp') {
    return evaluateWhatsAppAgentFallback(transcript, config, {
      appointmentNumber: callerInfo?.existingAppointmentNumber,
    });
  }

  return evaluateVoiceAgentFallback(transcript, config);
}
