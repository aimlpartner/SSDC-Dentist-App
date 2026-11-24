/**
 * @module @ssdc/medical-ai-agents
 * @description
 * Public SDK Entrypoint for Pillar 3 — Standalone Medical AI Agents Suite.
 *
 * Includes:
 * 1. Agent 1: `AICallingAgentWidget` (24/7 Voice AI Receptionist & Coordinator)
 * 2. Agent 2: `WhatsAppConciergeWidget` (Automated WhatsApp Business AI Concierge)
 * 3. Core Engine: `processMedicalAgentTurn`, `createMedicalFacilityConfig`, prompt builders, and CRM adapter types.
 *
 * Zero coupling to any single clinic—drop into any hospital app or medical CRM.
 */

export * from './core/types';
export * from './core/default-facility.config';
export * from './core/prompt-builder';
export * from './core/agent-engine';
export * from './agents/voice-calling-agent';
export * from './agents/whatsapp-concierge-agent';

