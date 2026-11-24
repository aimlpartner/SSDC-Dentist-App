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
        reply: config.voiceAgent.greetingMessage,
        action: 'none',
      });
    }

    const result = await processMedicalAgentTurn({
      channel: 'voice',
      transcript: body.transcript,
      conversationHistory: body.conversationHistory || [],
      callerInfo: body.callerInfo,
      facilityConfig: config,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('[MedicalAIAgentSDK] Voice agent endpoint error:', error);
    return NextResponse.json(
      {
        reply: DEFAULT_MEDICAL_FACILITY_CONFIG.voiceAgent.greetingMessage,
        action: 'none',
      },
      { status: 200 }
    );
  }
}

