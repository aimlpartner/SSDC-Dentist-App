import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

interface CallAgentRequestBody {
  transcript: string;
  conversationHistory: { role: 'agent' | 'user'; text: string }[];
  callerInfo?: {
    name?: string;
    phone?: string;
    isInternational?: boolean;
    existingAppointmentNumber?: string;
  };
}

export async function POST(req: NextRequest) {
  try {
    const body: CallAgentRequestBody = await req.json();
    const { transcript, conversationHistory = [], callerInfo } = body;

    if (!transcript || transcript.trim().length === 0) {
      return NextResponse.json({
        reply: "Hello! Thank you for calling Taj White Pearl Dental Hospital in Agra. I am Priya, your dental care coordinator. How may I assist your smile today?",
        action: 'none',
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    const systemPrompt = `You are "Priya", the Senior Patient Coordinator & Voice AI Receptionist at "Taj White Pearl Dental Hospital & Luxury Dental Spa" located in Agra, India (adjacent to Taj East Gate Road, overlooking the Taj Mahal gardens).
You are answering incoming voice phone calls from both local Agra residents and international dental tourists (from the UK, US, Australia, Europe, UAE).

YOUR PERSONALITY:
- Warm, polite, articulate, culturally gracious ("Namaste and welcome!"), reassuring, and medically knowledgeable.
- Keep your spoken replies concise, natural, and conversational (usually 1-3 sentences), because your response will be spoken aloud to the caller over a voice call.
- Do NOT use markdown asterisks (*, **), bullet lists, or URLs in your spoken text, as this is text-to-speech.

CLINIC DETAILS:
- Doctors: Dr. Aarav Sharma (Chief Implantologist & Maxillofacial Surgeon, 16 yrs exp) and Dr. Ananya Verma (Lead Aesthetic Dentist & Orthodontist, 13 yrs exp).
- Treatments: Taj Pearl Laser Whitening (45 mins, $145 / ₹12,000, 0 downtime, can see Taj Mahal same day), Porcelain Veneers ($220 / ₹18,000 per tooth), German Zirconia Implants ($520 / ₹42,000, 70% cheaper than UK/US), Painless Microscopic Root Canal ($110 / ₹8,500), Clear Aligners.
- Dental Tourism Services: Free private airport transfers from Delhi (IGI) or Agra Cantt, luxury tie-ups with The Oberoi Amarvilas and ITC Mughal, flexible appointments timed around Taj Mahal sunrise visits.
- Emergency: Same-day acute pain relief and walk-ins welcome at our Agra clinic suite.

YOUR RESPONSIBILITIES:
1. Bookings: Gather the caller's name, their dental concern (pain, whitening, implants, makeover), preferred doctor or date/time, and whether they are local or visiting Agra from abroad.
2. Rescheduling: If the caller says they want to reschedule or change their appointment time, ask for their appointment number (e.g. TWP-1042) or verify their name, and confirm their new requested slot.
3. Cancellations: Handle cancellation requests with gentle empathy and offer future assistance.
4. Inquiries & FAQs: Answer questions about costs, Taj tourism packages, pain management, recovery time, and doctor qualifications.

OUTPUT FORMAT:
You MUST respond with a JSON object containing:
{
  "reply": "The spoken response to be read to the caller via text-to-speech. (No markdown, no bullets).",
  "action": "none" | "book_appointment" | "reschedule_appointment" | "cancel_appointment" | "inquiry_answered",
  "extractedData": {
    "patientName": "string or null",
    "doctorName": "string or null",
    "problem": "string or null",
    "requestedDate": "string or null",
    "requestedTime": "string or null",
    "appointmentNumber": "string or null",
    "isInternational": true or false
  }
}`;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        
        // Build dialogue context
        const formattedHistory = conversationHistory.map(m => 
          `${m.role === 'agent' ? 'Priya (Agent)' : 'Caller'}: ${m.text}`
        ).join('\n');

        const prompt = `${systemPrompt}\n\nCONVERSATION CONTEXT:\n${formattedHistory}\n\nLATEST CALLER SPEECH:\n"${transcript}"\nCaller Info Metadata: ${JSON.stringify(callerInfo || {})}\n\nRespond strictly with valid JSON.`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.7,
          },
        });

        const text = response.text || '{}';
        const parsed = JSON.parse(text);
        return NextResponse.json(parsed);
      } catch (geminiError) {
        console.error('Gemini API call failed, falling back to rule-based speech engine:', geminiError);
      }
    }

    // Rule-based fallback if Gemini API is unavailable or returns an error
    const lower = transcript.toLowerCase();
    let reply = "Thank you for reaching Taj White Pearl Dental Hospital in Agra. Dr. Aarav and Dr. Ananya are currently consulting, but I can happily schedule your visit or answer any questions about our smile treatments and Taj Mahal tourism packages.";
    let action = 'inquiry_answered';
    const extractedData: Record<string, unknown> = {};

    if (lower.includes('reschedule') || lower.includes('change time') || lower.includes('change appointment') || lower.includes('postpone')) {
      reply = "Certainly! I would be pleased to help you reschedule your visit at Taj White Pearl. Could you please share your preferred day and whether morning or afternoon suits you best?";
      action = 'reschedule_appointment';
    } else if (lower.includes('cancel') || lower.includes('cannot make it') || lower.includes('can\'t come')) {
      reply = "I understand completely. We have updated your reservation so you won't be charged any fee. Please let us know whenever you are ready to visit us in Agra!";
      action = 'cancel_appointment';
    } else if (lower.includes('book') || lower.includes('appointment') || lower.includes('consultation') || lower.includes('see a doctor')) {
      reply = "Wonderful! I can schedule your consultation with Dr. Aarav Sharma for implants or Dr. Ananya Verma for smile veneers. What day works best for your visit to our Agra clinic?";
      action = 'book_appointment';
    } else if (lower.includes('whitening') || lower.includes('white') || lower.includes('cost') || lower.includes('price')) {
      reply = "Our signature Taj Pearl Laser Whitening is 145 US dollars or 12,000 rupees. It takes only 45 minutes with zero sensitivity, so you can comfortably visit the Taj Mahal right after!";
      action = 'inquiry_answered';
    } else if (lower.includes('implant') || lower.includes('teeth missing') || lower.includes('zirconia')) {
      reply = "Our German Zirconia implants start at 520 US dollars, offering over 70 percent savings compared to the UK or US, and include computer-guided 3D scans and lifetime warranty.";
      action = 'inquiry_answered';
    } else if (lower.includes('hotel') || lower.includes('tourism') || lower.includes('airport') || lower.includes('delhi')) {
      reply = "Yes, we provide complimentary airport transfers from Delhi or Agra Cantt and have partnered with heritage luxury hotels like The Oberoi Amarvilas right near the Taj Mahal.";
      action = 'inquiry_answered';
    }

    return NextResponse.json({
      reply,
      action,
      extractedData,
    });
  } catch (error) {
    console.error('Call agent endpoint error:', error);
    return NextResponse.json(
      {
        reply: "Thank you for calling Taj White Pearl Dental Hospital in Agra. I can assist you with bookings, reschedules, or dental questions. How may I help you?",
        action: 'none',
      },
      { status: 200 }
    );
  }
}
