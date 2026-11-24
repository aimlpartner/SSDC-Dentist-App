/**
 * Backwards-compatible Voice Calling Agent API Route (`/api/calling-agent`).
 * Delegates directly to Pillar 3 (`@/modules/ai-agents` — Standalone Medical AI Agent Engine).
 */
export { POST } from '../ai-agents/voice/route';
