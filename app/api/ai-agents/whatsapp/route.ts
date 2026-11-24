import { NextRequest, NextResponse } from 'next/server';
import {
  AgentEngineRequest,
  DEFAULT_MEDICAL_FACILITY_CONFIG,
  processMedicalAgentTurn,
} from '@/modules/ai-agents';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<AgentEngineRequest>;
    const config = body.facilityConfig || DEFAULT_MEDICAL_FACILITY_CONFIG;

    if (!body.transcript || body.transcript.trim().length === 0) {
      return NextResponse.json({
        reply: `Welcome to ${config.whatsappAgent.botName}! How may we assist you today?`,
        action: 'none',
      });
    }

    const result = await processMedicalAgentTurn({
      channel: 'whatsapp',
      transcript: body.transcript,
      conversationHistory: body.conversationHistory || [],
      callerInfo: body.callerInfo,
      facilityConfig: config,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('[MedicalAIAgentSDK] WhatsApp agent endpoint error:', error);
    return NextResponse.json(
      {
        reply: `Thank you for messaging ${DEFAULT_MEDICAL_FACILITY_CONFIG.whatsappAgent.botName}. Our team has received your inquiry.`,
        action: 'none',
      },
      { status: 200 }
    );
  }
}

